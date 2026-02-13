// use async_graphql::{
//   EmptyMutation, EmptySubscription, Schema, http::GraphiQLSource,
// };
use futures::executor::block_on;
use sea_orm::{Database, DbErr};

mod gql;
// mod models;
// mod flowchart;
// mod migrator;
mod entity;

// use gql::QueryRoot;

// TODO: 
// async fn gql_playground() -> HttpResponse {
//   HttpResponse::Ok()
//     .content_type("text/html; charset=utf-8")
//     .body(GraphiQLSource::build().endpoint("/").finish())
// }

const DATABASE_URL: &str = "sqlite:./sqlite.db?mode=rwc";
// const DB_NAME: &str = "sva_db";

async fn run() -> Result<(), DbErr> {
    let db = Database::connect(DATABASE_URL).await?;
    // db.get_schema_registry("innocamp_backend::entity::*").sync(db).await?;
    db.get_schema_registry(module_path!().split("::").next().unwrap()).sync(&db).await?;

    Ok(())
}

#[tokio::main]
async fn main() {
    if let Err(err) = block_on(run()) {
        panic!("{}", err);
    }
}
