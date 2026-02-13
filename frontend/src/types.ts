type NodeType = "simple-node" | "start-node" | "end-node" | "decision-node" | "input-node"

export type Node = {
  id: string
  title?: string,
  desc?: string,
  type: NodeType
  next: string
}

export type SimpleNode = Node & { type: "simple-node" }

export type StartNode = Node & { type: "start-node" }

export type EndNode = Omit<Node, "next"> & { type: "end-node" }

type QuestionNode = Node & {
  question: string,
} & ({ type: "decision-node" } | { type: "input-node" })

type DecisionNode = Omit<QuestionNode, "next"> & {
  decisions: Array<Node>
} & { type: "decision-node" }

type InputNode = QuestionNode & {
  input: "number" | "text" | "date"
} & { type: "input-node" }

export type Flowchart = Array<SimpleNode | StartNode | EndNode | DecisionNode | InputNode>
