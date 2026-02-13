use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "decision_node")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub question: String,
    #[sea_orm(has_many, via = "node_decisions")]
    pub decisions: HasMany<super::node::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}

