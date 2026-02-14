import { defineStore } from "pinia";
import { fetchFlow } from "../api";
import {
  Node,
  Flowchart,
  EndNode,
  InputNode,
  StartNode,
  UserData,
  RepeatNode,
} from "../types";
import { evalFlowOperation, setAtObjPath, deepMerge } from "../utils/util";

type AnyNode = Flowchart[number];

export const useFlowStore = defineStore("flow", {
  state: () => ({
    flow: [] as Flowchart,
    path: [] as AnyNode[], // History of visited nodes + current node
    currentStepIndex: 0, // Index in 'path' we are currently viewing/answering
    answers: {} as UserData,
  }),
  getters: {
    startNode(): AnyNode | undefined {
      return this.flow.find((n) => n.type === "start-node");
    },
    // Returns titles of all nodes in the path
    getTitles: (state) => {
      // We only want unique titles in sequence (groups)
      const groups: string[] = [];
      let lastTitle = "";

      state.path.forEach((node) => {
        if (
          node.title &&
          node.title !== lastTitle &&
          node.title.trim() !== ""
        ) {
          groups.push(node.title);
          lastTitle = node.title;
        }
      });
      return groups;
    },
    // Returns grouped path for rendering
    // Array of { title: string, nodes: { node: Node, index: number }[] }
    groupedPath: (state) => {
      const groups: {
        title: string;
        nodes: { node: AnyNode; index: number }[];
      }[] = [];
      let currentGroup: {
        title: string;
        nodes: { node: AnyNode; index: number }[];
      } | null = null;
      // Keep track of the last valid title to inherit
      let lastTitle = "";

      state.path.forEach((node, index) => {
        if (node.type === "eval-node") return;

        // Inherit title if missing
        let title = node.title;
        if (!title || title.trim() === "") {
          title = lastTitle;
        } else {
          lastTitle = title;
        }

        // If still no title (e.g. start node without title?), use empty or some default?
        // Start node usually has title "Willkommen"

        if (!currentGroup || currentGroup.title !== title) {
          if (currentGroup) {
            groups.push(currentGroup);
          }
          currentGroup = { title: title || "", nodes: [] };
        }

        currentGroup.nodes.push({ node, index });
      });

      if (currentGroup) {
        groups.push(currentGroup);
      }

      return groups;
    },
    // Returns the node at the current step index
    // If index out of bounds (shouldn't happen if logic is correct), returns null
    currentNode: (state): AnyNode | null => {
      if (
        state.currentStepIndex >= 0 &&
        state.currentStepIndex < state.path.length
      ) {
        return state.path[state.currentStepIndex];
      }
      return null;
    },
    isEndNode: (state) => {
      if (
        state.currentStepIndex >= 0 &&
        state.currentStepIndex < state.path.length
      ) {
        return state.path[state.currentStepIndex].type === "end-node";
      }
      return false;
    },
    // Helper to check if we are at the latest step
    isLatestStep: (state) => state.currentStepIndex === state.path.length - 1,
  },
  actions: {
    async fetchFlow() {
      this.flow = await fetchFlow();
      const start = this.flow.find((n) => n.type === "start-node");
      if (start) {
        this.path = [start];
        this.currentStepIndex = 0;
      } else {
        this.path = [];
      }
      this.answers = {} as UserData;

      // Start processing if start node or sequence starts with eval-nodes
      this.processAutoNodes();
    },
    submitAnswerAt(
      path: Array<string>,
      answer: any,
      op: "set" | "add" | "push",
    ) {
      setAtObjPath(this.answers, path, answer, op);
    },
    setAnswer(answer: any) {
      if (!!answer) {
        // We use deepMerge to preserve existing structure and ensure reactivity is handled correctly
        this.answers = deepMerge(JSON.parse(JSON.stringify(this.answers)), answer);
      }
    },
    // Internal helper to expand repeat-nodes
    _expandNodes(startId: string): AnyNode[] {
      const node = this.flow.find((n: AnyNode) => n.id === startId);
      if (!node) return [];

      if (node.type === "repeat-node") {
        const repeatNode = node as any;
        const count = evalFlowOperation(this.answers, repeatNode.n) || 0;
        const subNode = repeatNode.sub;

        const expanded: AnyNode[] = [];
        for (let i = 0; i < count; i++) {
          const newNode = JSON.parse(JSON.stringify(subNode));
          newNode.id = `${repeatNode.id}_${i}`;
          if (!newNode.title) newNode.title = repeatNode.title;

          if (newNode.path && Array.isArray(newNode.path)) {
            newNode.path = [...newNode.path, i.toString()];
          }

          if (i < count - 1) {
            newNode.next = `${repeatNode.id}_${i + 1}`;
          } else {
            newNode.next = repeatNode.next;
          }

          if (!this.flow.find((n: AnyNode) => n.id === newNode.id)) {
            this.flow.push(newNode);
          } else {
            const idx = this.flow.findIndex((n: AnyNode) => n.id === newNode.id);
            if (idx !== -1) this.flow[idx] = newNode;
          }

          if (newNode.type === "repeat-node") {
            expanded.push(...this._expandNodes(newNode.id));
          } else {
            expanded.push(newNode);
          }
        }

        if (count === 0) {
          const nextNextId = evalFlowOperation(this.answers, repeatNode.next);
          if (nextNextId) {
            expanded.push(...this._expandNodes(nextNextId));
          }
        }
        return expanded;
      } else {
        return [node];
      }
    },
    // Automatically processes eval-nodes until an interactive node is reached
    processAutoNodes() {
      let currentNode = this.currentNode;
      let iterations = 0;
      while (currentNode && currentNode.type === "eval-node" && iterations < 100) {
        iterations++;
        const evalNode = currentNode as any;
        
        if (evalNode.defaults) {
          this.setAnswer(evalNode.defaults);
        }

        const nextId = evalFlowOperation(this.answers, evalNode.next);
        if (!nextId) break;

        const nextNodes = this._expandNodes(nextId);
        if (nextNodes.length === 0) break;

        // Take all expanded nodes and append to path
        this.path.push(...nextNodes);
        // Note: we might be pushing multiple nodes if nextId was a RepeatNode
        // We should skip to the end of the sequence? 
        // No, currentStepIndex should move to the NEXT one in path.
        this.currentStepIndex = this.path.length - nextNodes.length; 
        // Wait, currentStepIndex should point to the FIRST of the nextNodes sequence.
        // Actually, we want to continue the while loop from the NEW currentNode.
        currentNode = this.currentNode;
      }
    },
    async submitAnswer(answer: any) {
      const currentNode = this.currentNode;
      if (!currentNode || currentNode.type === "end-node") return;
      if (!!answer) this.answers = answer;

      console.log("1", currentNode.next, this.answers)
      // 2. Resolve NEXT node(s)
      const nextId = evalFlowOperation(this.answers, currentNode.next);
      console.log("2")

      if (!nextId) {
        // If explicitly null/undefined, maybe end?
        console.warn("No next node found");
        return;
      }

      const nextNodes = this._expandNodes(nextId);

      if (nextNodes.length === 0) {
        console.warn("Next resolution resulted in empty steps");
        return;
      }

      // 3. Update Path / Divergence Check
      // We take the first node from expanded list as the target "next" step.
      // If we have multiple (from repeat), we want to append them all sequence-wise?
      // Standard flow logic: Only append what we visit.
      // But for RepeatNode, we effectively "visit" the expansion decision.
      // If we are at Step A. Next is Repeat -> expands to B, C.
      // We should show B.
      // When B is answered, it will naturally go to C (because we linked next of B to C).
      // So we only need to append B to the path?
      // And 'submitAnswer(B)' will find C.
      // YES.
      // EXCEPT if we are verifying "path divergence" for future nodes.
      // If path was [A, B, C].
      // We are at A. Expand -> [B', C'].
      // if B == B', we go to B.
      // But we should ensure C' is also consistent?
      // Actually 'submitAnswer(B)' handles C when we get there.
      // The only risk is if we "jump" over nodes? No.
      // So we just handle the FIRST node of the sequence.

      const targetNextNode = nextNodes[0];

      if (this.currentStepIndex < this.path.length - 1) {
        const nextNodeInPath = this.path[this.currentStepIndex + 1];
        if (nextNodeInPath.id !== targetNextNode.id) {
          // Divergence
          this.path = this.path.slice(0, this.currentStepIndex + 1);
          this.path.push(targetNextNode);
          this.currentStepIndex++;
        } else {
          // On track
          this.currentStepIndex++;
        }
      } else {
        // Append
        this.path.push(targetNextNode);
        this.currentStepIndex++;
      }

      // 4. After appending new nodes, check if the NEW current node is an eval-node
      this.processAutoNodes();
    },

    back() {
      if (this.currentStepIndex > 0) {
        this.currentStepIndex--;
      }
    },

    jumpTo(index: number) {
      if (index >= 0 && index < this.path.length) {
        // We allow jumping to any visited step
        // We do NOT truncate history just by jumping.
        // History is stuck until they submit an answer that changes the path.
        this.currentStepIndex = index;
      }
    },
  },
});
