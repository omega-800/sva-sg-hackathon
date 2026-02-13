import { defineStore } from "pinia";
import { fetchFlow } from "../api";
import { Node, Flowchart, EndNode, InputNode, StartNode, UserData } from "../types";
import { Question } from "../data/stepTwoData";

type AnyNode = Flowchart[number];

export const useFlowStore = defineStore("flow", {
  state: () => ({
    flow: [] as Flowchart,
    path: [] as AnyNode[], // History of visited nodes + current node
    currentStepIndex: 0,   // Index in 'path' we are currently viewing/answering
    answers: {} as UserData
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
        
        state.path.forEach(node => {
            if (node.title && node.title !== lastTitle && node.title.trim() !== "") {
                groups.push(node.title);
                lastTitle = node.title;
            }
        });
        return groups;
    },
    // Returns grouped path for rendering
    // Array of { title: string, nodes: { node: Node, index: number }[] }
    groupedPath: (state) => {
        const groups: { title: string, nodes: { node: AnyNode, index: number }[] }[] = [];
        let currentGroup: { title: string, nodes: { node: AnyNode, index: number }[] } | null = null;
        // Keep track of the last valid title to inherit
        let lastTitle = "";

        state.path.forEach((node, index) => {
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
      if (state.currentStepIndex >= 0 && state.currentStepIndex < state.path.length) {
        return state.path[state.currentStepIndex];
      }
      return null;
    },
    // Returns the current question object for StepTwo based on currentNode
    currentQuestion: (state): Question | null => {
      // Access getter logic via 'this' if possible, or replicate check
      // Pinia getters receive 'state'. To access other getters, use 'this'.
      // But inside arrow function 'this' might be tricky. 
      // Safest to re-evaluate or use `function(state) { ... }` style for 'this'.
      // However, we can just use state accessing logic here directly.
      if (state.currentStepIndex >= 0 && state.currentStepIndex < state.path.length) {
         const node = state.path[state.currentStepIndex];
         return node;
      }
      return null;
    },
    isEndNode: (state) => {
        if (state.currentStepIndex >= 0 && state.currentStepIndex < state.path.length) {
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
      this.answers = {};
    },

    submitAnswer(answer: any) {
      const currentNode = this.currentNode;
      if (!currentNode || currentNode.type === "end-node") return;

      // 1. Check if we are changing an existing answer in history
      // or if we are just moving forward from the latest step.
      
      const existingAnswer = this.answers[currentNode.id];
      const answerChanged = JSON.stringify(existingAnswer) !== JSON.stringify(answer);

      // Store the new answer
      this.answers[currentNode.id] = answer;

      // Calculate the NEXT node based on this answer
      let nextId: string | undefined;

      if (currentNode.type === "input-node") {
        nextId = (currentNode as InputNode).next;
      } else {
        nextId = (currentNode as Node).next;
      }

      if (!nextId) {
          console.warn("No next node found");
          return;
      }
      const nextNode = this.flow.find((n) => n.id === nextId);
      if (!nextNode) {
          console.warn("Next node not found in flow", nextId);
          return;
      }

      // If we are NOT at the end of the path (editing history)
      if (this.currentStepIndex < this.path.length - 1) {
          // Check if the next node in the existing path is the SAME as what we just calculated
          const nextNodeInPath = this.path[this.currentStepIndex + 1];
          
          if (answerChanged || nextNodeInPath.id !== nextNode.id) {
              // DIVERGENCE! Truncate history
              // Remove everything after current node
              this.path = this.path.slice(0, this.currentStepIndex + 1);
              // Append new next node
              this.path.push(nextNode);
              this.currentStepIndex++;
          } else {
              // NO DIVERGENCE. Just move forward without modifying path
              this.currentStepIndex++;
          }
      } else {
          // We are at the end of the path (latest step). Just append.
          // Don't duplicate if for some reason it's already there (though logic above prevents currentStepIndex < length-1)
          this.path.push(nextNode);
          this.currentStepIndex++;
      }
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
    }
  },
});
