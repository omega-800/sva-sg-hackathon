import { defineStore } from "pinia";
import { fetchFlow } from "../api";
import { Node, Flowchart, EndNode } from "../types";

export const useFlowStore = defineStore("flow", {
  state: () => ({
        flow: [] as Flowchart,
      currentNode: null as Node | EndNode | null,
  }),
  getters: {
    startNode(): Node | undefined {
      return this.flow.find((n) => n.type === "start-node");
      },
      getTitles: (state) => {
        return state.flow.map((n) => n.title || "").filter((t) => t !== "");
      },
      getNext: (state) => {
      return state.flow
        .filter((n) => n.type !== "end-node" && n.type !== "decision-node")
          .find((n) => {
            if (!state.currentNode || state.currentNode.type === "end-node") return false;
            return n.id === state.currentNode.next;
        });
    },
  },
  actions: {
    async fetchFlow() {
          this.flow = await fetchFlow();
            this.currentNode = this.flow.find((n) => n.type === "start-node") || null;
      },
      
  },
});
