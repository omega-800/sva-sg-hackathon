use async_graphql::{
  dynamic::Schema,
  http::{GraphQLPlaygroundConfig, playground_source},
};
use async_graphql_poem::{GraphQLRequest, GraphQLResponse};
use dotenv::dotenv;
use poem::{
  EndpointExt, IntoResponse, Route, Server, get, handler,
  listener::TcpListener,
  web::{Data, Html},
};
use sea_orm::Database;
use seaography::{async_graphql, lazy_static::lazy_static};
use std::env;

mod entity;
mod query_root;

lazy_static! {
    // TODO: dotenv
  static ref URL: String = env::var("URL").unwrap_or("localhost:8000".into());
  static ref ENDPOINT: String = env::var("ENDPOINT").unwrap_or("/".into());
  static ref DATABASE_URL: String =
    env::var("DATABASE_URL").unwrap_or("sqlite:./sqlite.db?mode=rwc".into());
  static ref DEPTH_LIMIT: Option<usize> = env::var("DEPTH_LIMIT")
    .map_or(None, |data| Some(
      // data.parse().expect("DEPTH_LIMIT is not a number")
      data.parse().unwrap_or(1)
    ));
  static ref COMPLEXITY_LIMIT: Option<usize> = env::var("COMPLEXITY_LIMIT")
    .map_or(None, |data| {
      Some(
                // data.parse().expect("COMPLEXITY_LIMIT is not a number")
                data.parse().unwrap_or(1)
            )
    });
}

#[handler]
async fn graphql_playground() -> impl IntoResponse {
  Html(playground_source(GraphQLPlaygroundConfig::new(&ENDPOINT)))
}

#[handler]
async fn graphql_handler(
  schema: Data<&Schema>,
  req: GraphQLRequest,
) -> GraphQLResponse {
  let req = req.0;
  schema.execute(req).await.into()
}

#[tokio::main]
async fn main() {
  // TODO: remove the unwraps
  dotenv().ok();
  let database = Database::connect(&*DATABASE_URL)
    .await
    .expect("Failed to initialize database connection");
  database
    .get_schema_registry(module_path!().split("::").next().unwrap())
    .sync(&database)
    .await
    .unwrap();
  let schema =
    query_root::schema(database, *DEPTH_LIMIT, *COMPLEXITY_LIMIT).unwrap();
  let app = Route::new().at(
    &*ENDPOINT,
    get(graphql_playground).post(graphql_handler).data(schema),
  );
  println!("Visit GraphQL Playground at http://{}", *URL);
  Server::new(TcpListener::bind(&*URL))
    .run(app)
    .await
    .expect("Fail to start web server");
}
