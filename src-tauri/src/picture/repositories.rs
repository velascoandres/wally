use std::sync::Arc;
use sqlx::SqlitePool;
use crate::{db::ConnectionPool, common::RepositoryError, common::FindResponse};
use crate::picture::sql::PLAYLIST_JOIN_QUERY;
use super::models::{CreatePlaylistItem, CreateUpdatePicture, Picture, PopulatedPlaylist, SearchPicture};


pub struct PictureRepository {
    conn: Arc<SqlitePool>,
}

pub struct PlaylistRepository {
    conn: Arc<SqlitePool>,
}

impl PictureRepository {
    pub fn new(conn: SqlitePool) -> Self {
        PictureRepository {
            conn: Arc::new(conn)
        }
    }

    fn conn(&self) -> &ConnectionPool {
        &self.conn
    }

    pub async fn find_by_id(&mut self, id: &i64) -> Result<Picture, RepositoryError> {
        let fetch_result = sqlx::query_as::<_, Picture>("SELECT * FROM PICTURES WHERE id=$1")
            .bind(id)
            .fetch_one(self.conn()).await;

        match fetch_result {
            Ok(picture) => Ok(picture),
            Err(err) => Err(RepositoryError::FindError(format!("{err}"))),
        }
    }


    pub async fn create(&mut self, picture: CreateUpdatePicture) -> Result<Picture, RepositoryError> {
        let result =
            sqlx::query("INSERT INTO PICTURE (name, file) values ($1, $2, $3)")
                .bind(&picture.name)
                .bind(&picture.file)
                .execute(self.conn())
                .await;
        match result {
            Ok(insert_result) => self.find_by_id(&insert_result.last_insert_rowid()).await,
            Err(err) => Err(RepositoryError::CreateError(format!("{err}"))),
        }
    }

    pub async fn find_many(&self, params: SearchPicture) -> Result<FindResponse<Picture>, RepositoryError> {
        let search = params.search;

        let condition = "WHERE (name LIKE '%'|| $1 ||'%' OR $1 IS NULL)";
        let search_query = format!("SELECT * FROM PICTURE {condition}");
        let count_query = format!("SELECT COUNT(id) FROM PICTURE {condition}");

        let data_result = sqlx::query_as
            ::<_, Picture>(&search_query)
            .bind(&search)
            .fetch_all(self.conn());

        let count_result = sqlx::query_scalar::<_, u64>(&count_query)
            .bind(&search)
            .fetch_one(self.conn());

        let results = tokio::try_join!(data_result, count_result);

        match results {
            Ok((data, count)) => Ok(
                FindResponse {
                    data,
                    total: count,
                }
            ),
            Err(err) => Err(RepositoryError::FindError(err.to_string()))
        }
    }

    pub async fn remove(&mut self, id: &i64) -> Result<i64, RepositoryError> {
        let delete_result = sqlx::query("DELETE FROM PICTURE WHERE id='$1'")
            .bind(id)
            .execute(self.conn())
            .await;

        match delete_result {
            Ok(_) => Ok(1),
            Err(err) => Err(RepositoryError::RemoveError(err.to_string()))
        }
    }
}


impl PlaylistRepository {
    pub fn new(conn: SqlitePool) -> Self {
        PlaylistRepository {
            conn: Arc::new(conn)
        }
    }

    fn conn(&self) -> &ConnectionPool {
        &self.conn
    }

    pub async fn find_by_id(&mut self, id: &i64) -> Result<PopulatedPlaylist, RepositoryError> {
        let search_query = format!("{PLAYLIST_JOIN_QUERY} WHERE id=$1");

        let fetch_result = sqlx::query_as::<_, PopulatedPlaylist>(search_query.as_str())
            .bind(id)
            .fetch_one(self.conn()).await;

        match fetch_result {
            Ok(playlist) => Ok(playlist),
            Err(err) => Err(RepositoryError::FindError(format!("{err}"))),
        }
    }

    pub async fn create(&mut self, picture: CreatePlaylistItem) -> Result<PopulatedPlaylist, RepositoryError> {
        let result =
            sqlx::query("INSERT INTO PLAYLIST (id, name, file) values ($1, $2, $3)")
                .bind(&picture.picture_id)
                .bind(&picture.order)
                .execute(self.conn())
                .await;
        match result {
            Ok(insert_result) => self.find_by_id(&insert_result.last_insert_rowid()).await,
            Err(err) => Err(RepositoryError::CreateError(format!("{err}"))),
        }
    }

    pub async fn find_many(&self) -> Result<FindResponse<PopulatedPlaylist>, RepositoryError> {
        ;
        let count_query = "SELECT COUNT(id) FROM PLAYLIST";

        let data_result = sqlx::query_as
            ::<_, PopulatedPlaylist>(PLAYLIST_JOIN_QUERY)
            .fetch_all(self.conn());

        let count_result = sqlx::query_scalar::<_, u64>(count_query)
            .fetch_one(self.conn());

        let results = tokio::try_join!(data_result, count_result);

        match results {
            Ok((data, count)) => Ok(
                FindResponse {
                    data,
                    total: count,
                }
            ),
            Err(err) => Err(RepositoryError::FindError(err.to_string()))
        }
    }

    pub async fn remove(&mut self, id: i64) -> Result<i64, RepositoryError> {
        let delete_result = sqlx::query("DELETE FROM PLAYLIST WHERE id=$1")
            .bind(id)
            .execute(self.conn())
            .await;

        match delete_result {
            Ok(_) => Ok(1),
            Err(err) => Err(RepositoryError::RemoveError(err.to_string()))
        }
    }
}

