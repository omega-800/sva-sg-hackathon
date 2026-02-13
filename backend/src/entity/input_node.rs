use sea_orm::{entity::prelude::*};

#[derive(EnumIter, DeriveActiveEnum, Clone, Debug, PartialEq, Eq)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "kebab-case")]
pub enum InputType {
    Number,
    Text,
    Date
}

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "input_node")]
pub struct Model {
    // #[sea_orm(primary_key, auto_increment = false)]
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub question: String,
    pub input: InputType,
    #[sea_orm(belongs_to, from = "id", to = "id")]
    pub next: HasOne<super::node::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}
