type NodeType = "simple-node" | "start-node" | "end-node" | "decision-node" | "input-node"

interface Node {
  id: string
  title?: string,
  desc?: string,
  type: NodeType
}

interface SimpleNode {
  next: string,
}

interface StartNode extends SimpleNode { }

interface EndNode extends Node { }

interface QuestionNode extends Node {
  question: string,
}

interface DecisionNode extends QuestionNode {
  decisions: Array<SimpleNode>
}

interface InputNode extends QuestionNode, SimpleNode {
  input: "number" | "text" | "date"
}

type Flowchart = Array<Node>

const example = [
  {id: "asdf", next: "qwer"},
  {id: "qwer", next: "end", title: "weeeooo"},
  {id: "end"},
]
