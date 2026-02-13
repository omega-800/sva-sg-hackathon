use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "end_node")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
}

impl ActiveModelBehavior for ActiveModel {}

