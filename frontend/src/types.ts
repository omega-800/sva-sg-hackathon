type NodeType =
  | "simple-node"
  | "start-node"
  | "end-node"
  | "decision-node"
  | "input-node";

export type Node = {
  id: string;
  title?: string;
  desc?: string;
  type: NodeType;
  next: string;
};

export type SimpleNode = Node & { type: "simple-node" };

export type StartNode = Node & { type: "start-node" };

export type EndNode = Omit<Node, "next"> & { type: "end-node" };

type QuestionNode = Node & {
  question: string;
  path: Array<string>;
  op?: "add" | "set";
} & ({ type: "decision-node" } | { type: "input-node" });

export type DecisionNode = Omit<QuestionNode, "next"> & {
  decisions: Array<Node>
} & { type: "decision-node" }

export type InputNode = QuestionNode & {
  input: "number" | "text" | "date"
} & { type: "input-node" }

export type Flowchart = Array<
  SimpleNode | StartNode | EndNode | DecisionNode | InputNode
>;

// export type Rules = {
//
// }
//
// export type Calculation = {
//   grundbedarf: null,
//   mietzins: null,
//   kgv: null,
//   vermögen: null,
//   einkommen: null
// }

export type UserData = {
  personalien: {
    ausweis: string;
    alter: number;
  };
  finanzen: {
    personen: number;
  };
  wohnen: {
    wohnort: string;
    wohnform: string;
  };
  arbeit: {
    taetig: boolean;
    lohn: number;
    pensum: number;
    plz: number;
  };
  vermoegen: {
    vorhanden: boolean;
    betrag: number;
    fahrzeug: {
      vorhanden: boolean;
      betrag: number;
    };
  };
};
