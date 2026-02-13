use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "flowchart")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
    #[sea_orm(has_many)]
    pub next: HasMany<super::node::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}

