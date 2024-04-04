use sqlx::{sqlite::SqlitePoolOptions, Error, SqlitePool};


pub type ConnectionPool = SqlitePool;

pub async fn get_pool(connection_uri: &str) -> Result<ConnectionPool, Error>{
    let pool = SqlitePoolOptions::new()
        .connect(connection_uri)
        .await
        .expect("Error building connection pool");

    Ok(pool)
}
