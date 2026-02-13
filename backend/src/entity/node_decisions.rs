use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "node_decisions")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub decision_id: Uuid,
    #[sea_orm(primary_key)]
    pub node_id: Uuid,
    #[sea_orm(belongs_to, from = "decision_id", to = "id")]
    pub decision: Option<super::decision_node::Entity>,
    #[sea_orm(belongs_to, from = "node_id", to = "id")]
    pub node: Option<super::node::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}

