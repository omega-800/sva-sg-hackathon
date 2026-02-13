interface Node {
  id: string
  title?: string,
  desc?: string,
}

interface SimpleNode {
  next: string,
}

interface StartNode extends SimpleNode { }

interface EndNode extends Node { }

interface DecisionNode extends Node {
  question: string,
  decisions: Array<SimpleNode>
}

type Flowchart = Array<Node>

const example = [
  {id: "asdf", next: "qwer"},
  {id: "qwer", next: "end", title: "weeeooo"},
  {id: "end"},
]
