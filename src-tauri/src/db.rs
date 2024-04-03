use serde::Deserialize;
use sqlx::{migrate::MigrateDatabase, sqlite::SqlitePoolOptions, Error, SqlitePool};


#[derive(Deserialize, Debug, sqlx::FromRow)]
struct TableDB{
    pub name: String
}

pub type ConnectionPool = SqlitePool;

pub async fn get_pool(connection_uri: &str) -> Result<ConnectionPool, Error>{

     if !sqlx::Sqlite::database_exists(connection_uri).await? {
        sqlx::Sqlite::create_database(connection_uri).await?;
    }    
    
    let pool = SqlitePoolOptions::new()
        .connect(connection_uri)
        .await
        .expect("Error building connection pool");

    Ok(pool)
}

pub async fn load_model(conn: &SqlitePool, model_name: &str, model_definition: &str) -> Result<(), sqlx::Error>{
    let result = sqlx::query_as::<_, TableDB>("SELECT name FROM sqlite_master WHERE type='table' AND name=$1")
    .bind(model_name)
    .fetch_optional(conn).await;

    match result {
        Ok(table_result) => {
            match table_result {
                Some(table) => {
                    println!("[MODEL] found {}", table.name);
                    let _ = sqlx::query(format!("ALTER TABLE {model_name} {model_definition}").as_str())
                    .execute(conn)
                    .await;

                    println!("[MODEL] model '{}' was updated", table.name);
                    Ok(())
                },
                None => {
                    let _ = sqlx::query(model_definition)
                    .execute(conn)
                    .await;

                    println!("[MODEL] model '{}' was created", model_name);
                    Ok(())
                },
            }
        },
        Err(err) => {
            println!("Error on initialized model {:?}", err);

            Err(err)
        },
    }
}