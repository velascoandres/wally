use std::sync::Arc;
use uuid::Uuid;
use sqlx::SqlitePool;
use crate::{db::ConnectionPool, common::RepositoryError};
use super::models::{CreateUpdatePicture, PictureModel};

pub struct PictureRepository {
    conn: Arc<SqlitePool>
}

impl PictureRepository {
    pub fn new (conn: SqlitePool) -> Self {
        PictureRepository{
            conn: Arc::new(conn)
        }
    }

    fn get_conn(&self) -> &ConnectionPool{
        &self.conn
    }

    pub async fn find_by_id(&mut self, id: &str) -> Result<PictureModel, RepositoryError>{
        let fetch_result = sqlx::query_as::<_, PictureModel>("SELECT * FROM PICTURES WHERE id=$1")
            .bind(id)
            .fetch_one(self.get_conn()).await;

        match fetch_result {
            Ok(picture) => Ok(picture),
            Err(err) => Err(RepositoryError::FindError(format!("{err}"))),
        }
    }


    pub async fn create(&mut self, picture: CreateUpdatePicture)  -> Result<PictureModel, RepositoryError>{
        let id = Uuid::new_v4();


        let result =
            sqlx::query("INSERT INTO PICTURE (id, name, file) values ($1, $2, $3)")
                .bind(&id.to_string())
                .bind(&picture.name)
                .bind(&picture.file)
                .execute(self.get_conn())
                .await;
        match result {
            Ok(_) => self.find_by_id(id.to_string().as_str()).await,
            Err(err) => Err(RepositoryError::CreateError(format!("{err}"))),
        }

    }
}

