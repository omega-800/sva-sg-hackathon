use actix_web::{App, HttpResponse, HttpServer, guard, web};
use async_graphql::{EmptyMutation, EmptySubscription, Schema, http::GraphiQLSource};
use async_graphql_actix_web::GraphQL;

mod models;
mod gql;

use gql::QueryRoot;

async fn gql_playground() -> HttpResponse {
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(GraphiQLSource::build().endpoint("/").finish())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("\nRunning on http://127.0.0.1:8000/\n");
    HttpServer::new(move || {
        let schema = Schema::new(QueryRoot, EmptyMutation, EmptySubscription);

        App::new()
            .service(
                web::resource("/")
                    .guard(guard::Post())
                    .to(GraphQL::new(schema)),
            )
            .service(web::resource("/").guard(guard::Get()).to(gql_playground))
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}
