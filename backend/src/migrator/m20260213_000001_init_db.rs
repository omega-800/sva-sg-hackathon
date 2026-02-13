use async_graphql::Enum;
use sea_orm::{DeriveActiveEnum, EnumIter};
use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
  fn name(&self) -> &str {
    "m20260213_000001_init_db"
  }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
  async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .create_table(
        Table::create()
          .table(Node::Table)
          .col(
            ColumnDef::new(Node::Id)
              .uuid()
              .primary_key()
              .not_null()
              // .unique()
              .default(uuid::Uuid::new_v4()),
          )
          .col(ColumnDef::new(Node::Title).string())
          .col(ColumnDef::new(Node::Desc).string())
          .col(
            ColumnDef::new(Node::Type)
              .enum_type::<NodeType>()
              .not_null(),
          )
          .to_owned(),
      )
      .await
  }

  // Define how to rollback this migration: Drop the Bakery table.
  async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    manager
      .drop_table(Table::drop().table(Node::Table).to_owned())
      .await
  }
}

#[derive(Iden)]
pub enum Node {
  Table,
  Id,
  Title,
  Desc,
  Type,
}
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum NodeType {
  #[sea_orm(string_value = "simple-node")]
  SimpleNode,
  #[sea_orm(string_value = "start-node")]
  StartNode,
  #[sea_orm(string_value = "end-node")]
  EndNode,
  #[sea_orm(string_value = "decision-node")]
  DecisionNode,
  #[sea_orm(string_value = "input-node")]
  InputNode,
}
