use sea_orm::{entity::prelude::*, value::Value, ActiveModelTrait};
use sea_orm::prelude::*;
use sea_orm::DeriveId;
use uuid::Uuid;

#[derive(Debug, Enum, SeaEnum)]
pub enum NodeType {
    SimpleNode,
    StartNode,
    EndNode,
    DecisionNode,
    InputNode,
}

// Define the Node struct
#[derive(Debug, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "nodes")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub title: Option<String>,
    pub desc: Option<String>,
    pub node_type: NodeType,
}

// Define ActiveModel for Node
#[derive(Debug, Clone, ActiveModelTrait)]
pub struct ActiveModel {
    pub id: Set<Uuid>,
    pub title: Set<Option<String>>,
    pub desc: Set<Option<String>>,
    pub node_type: Set<NodeType>,
}

// Structs for specific node types
#[derive(Debug, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "simple_nodes")]
pub struct SimpleNode {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub next: Uuid,
}

// Define additional structs for other node types
#[derive(Debug, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "end_nodes")]
pub struct EndNode {
    #[sea_orm(primary_key)]
    pub id: Uuid,
}

// Extend for DecisionNode
#[derive(Debug, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "decision_nodes")]
pub struct DecisionNode {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub question: String,
    pub decisions: Vec<SimpleNode>,
}

// Extend for InputNode
#[derive(Debug, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "input_nodes")]
pub struct InputNode {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub question: String,
    pub input_type: String, // Can store "number", "text", or "date"
    pub next: Uuid,
}

// type NodeType = "simple-node" | "start-node" | "end-node" | "decision-node" | "input-node"
//
// interface Node {
//   id: string
//   title?: string,
//   desc?: string,
//   type: NodeType
// }
//
// interface SimpleNode {
//   next: string,
// }
//
// interface StartNode extends SimpleNode { }
//
// interface EndNode extends Node { }
//
// interface QuestionNode extends Node {
//   question: string,
// }
//
// interface DecisionNode extends QuestionNode {
//   decisions: Array<SimpleNode>
// }
//
// interface InputNode extends QuestionNode, SimpleNode {
//   input: "number" | "text" | "date"
// }
//
// type Flowchart = Array<Node>
//
// const example = [
//   {id: "asdf", next: "qwer"},
//   {id: "qwer", next: "end", title: "weeeooo"},
//   {id: "end"},
// ]
