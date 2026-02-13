import { Node, DecisionNode, InputNode, StartNode, EndNode } from "../types";
import { Question } from "../data/stepTwoData";

type AnyNode = Node | DecisionNode | InputNode | StartNode | EndNode;

export const convertNodeToQuestion = (node: AnyNode): Question | null => {
  if (node.type === "decision-node") {
    const decisionNode = node as DecisionNode;
    return {
      id: decisionNode.id,
      text: decisionNode.question,
      type: "radio",
      options: decisionNode.decisions.map((d) => ({
        label: d.title || "",
        value: d.id,
      })),
    };
  } else if (node.type === "input-node") {
    const inputNode = node as InputNode;
    return {
      id: inputNode.id,
      text: inputNode.question,
      type: "inputs",
      fields: [
        {
          id: inputNode.id, // Use node ID as field ID for simplicity
          label: inputNode.question, 
          type: inputNode.input,
        },
      ],
    };
  }
  return null;
};
