import { defineStore } from "pinia";
import { fetchFlow } from "../api";
import { Node, Flowchart, EndNode } from "../types";

export const useFlowStore = defineStore("flow", {
  state: () => ({
    prevFlow: [] as Flowchart,
    flow: [] as Flowchart,
    currentNode: null as Node | EndNode | null,
  }),
  getters: {
    startNode(): Node | undefined {
      return this.flow.find((n) => n.type === "start-node");
    },
    getTitles: (state) =>
      state.flow.map((n) => n.title || "").filter((t) => t !== ""),
    getNext: (state) =>
      state.flow
        .filter((n) => n.type !== "end-node" && n.type !== "decision-node")
        .find(
          (n) =>
            !!state.currentNode &&
            state.currentNode.type !== "end-node" &&
            n.id === state.currentNode.next,
        ),
  },
  actions: {
    async fetchFlow() {
      this.flow = await fetchFlow();
      this.currentNode = this.flow.find((n) => n.type === "start-node") || null;
    },
    startEditingFlow() {
      this.prevFlow = structuredClone(this.flow) 
    }
  },
});
