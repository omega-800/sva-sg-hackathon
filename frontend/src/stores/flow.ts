import { defineStore } from "pinia";
import { fetchFlow } from "../api";
import { Node, Flowchart, EndNode } from "../types";

export const useFlowStore = defineStore("flow", {
  state: () => ({
    flow: [] as Flowchart,
  }),
  getters: {
    startNode(): Node | undefined {
      return this.flow.find((n) => n.type === "start-node");
    }
  },
  actions: {
    async fetchFlow() {
      this.flow = await fetchFlow();
      },
      getNext(next: string): Node | undefined {
      return this.flow
        .filter((n) => n.type !== "end-node" && n.type !== "decision-node")
        .find((n) => n.id === next);
    },
  },
});
