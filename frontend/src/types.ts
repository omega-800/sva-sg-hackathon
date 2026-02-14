export type NodeType =
  | "simple-node"
  | "start-node"
  | "end-node"
  | "repeat-node"
  | "input-node";

export type Prim = number | string | boolean;
export type Operation =
  | {
      op: "if";
      val: Operation | Prim | Array<string>;
      lhs: Operation | Prim | Array<string>;
      rhs: Operation | Prim | Array<string>;
    }
  | {
      op: "all" | "some";
      val: Array<Operation | Prim | Array<string>>;
      lhs: Operation | Prim | Array<string>;
      rhs: Operation | Prim | Array<string>;
    }
  | {
      op: "sub" | "add" | "lt" | "gt" | "eq" | "div" | "mul";
      lhs: Operation | Prim | Array<string>;
      rhs: Operation | Prim | Array<string>;
    };

export type Node = {
  id: string;
  title?: string;
  desc?: string;
  type: NodeType;
  next: string | Operation;
};

export type RepeatNode = Node & { sub: Node; n: Operation | number | Array<string>; type: "repeat-node" };

export type SimpleNode = Node & { type: "simple-node" };

export type StartNode = Node & { type: "start-node" };

export type EndNode = Omit<Node, "next"> & { type: "end-node" };

export type QuestionNode = Node & {
  question: string;
  path: Array<string>;
  op?: "add" | "set" | "push";
} & ({ type: "decision-node" } | { type: "input-node" });

export type InputNode = QuestionNode & { type: "input-node" } & (
    | {
        input: "number" | "text" | "date";
      }
    | {
        input: "radio" | "checkbox";
        choices: Array<{
          title: string;
          value: any;
        }>;
      }
    | {
        input: "range";
        from: number;
        to: number;
      }
  );

export type Flowchart = Array<
  RepeatNode | SimpleNode | StartNode | EndNode | InputNode
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
    ausweis: "CH"|"C"|"B"|"B'"|"F"|"F'"|"S";
    alter: number;
  };
  finanzen: {
    personen: number;
    extraPersonen: Array<"E"|"K"|"F">
  };
  wohnen: {
    wohnort: string;
    wohnform: "W"|"M"|"U"|"P"|"H"|"O"|"G";
  };
  arbeit: {
    taetig: boolean;
    lohn: number;
    pensum: number;
    plz: number;
    verpflegung: number;
    fahrspesen: number;
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
