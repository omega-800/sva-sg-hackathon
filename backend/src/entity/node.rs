use sea_orm::entity::prelude::*;
use uuid::Uuid;

#[derive(EnumIter, DeriveActiveEnum, Clone, Debug, PartialEq, Eq)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "kebab-case")]
pub enum NodeType {
    SimpleNode,
    StartNode,
    EndNode,
    DecisionNode,
    InputNode,
}

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "node")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub title: Option<String>,
    pub desc: Option<String>,
    pub r#type: NodeType,
    // FIXME: wonky
    #[sea_orm(has_many)]
    pub prev_simple_nodes: HasMany<super::simple_node::Entity>,
    #[sea_orm(has_many)]
    pub prev_end_nodes: HasMany<super::end_node::Entity>,
    #[sea_orm(has_many, via = "node_decisions")]
    pub prev_decision_nodes: HasMany<super::decision_node::Entity>,
    #[sea_orm(has_many)]
    pub prev_start_nodes: HasMany<super::start_node::Entity>,
    #[sea_orm(has_many)]
    pub prev_input_nodes: HasMany<super::input_node::Entity>,
    #[sea_orm(belongs_to, from = "id", to = "id")]
    pub flowchart: HasOne<super::flowchart::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}
