use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Debug, Clone, sqlx::FromRow, Serialize)]
#[sqlx(rename_all = "camelCase")]

pub struct PictureModel {
    pub id: String,
    pub name: String,
    pub file_blob: Vec<u8>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone, sqlx::FromRow, Serialize)]
#[sqlx(rename_all = "camelCase")]

pub struct PlaylistModel {
    pub id: String,
    pub picture_id: String,
    pub order: u64,

    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone)]

pub struct CreatePlaylistItem {
    pub picture_id: u64,
    pub order: u64,
}

#[derive(Deserialize, Debug, Clone)]

pub struct CreateUpdatePicture {
    pub name: String,
    pub file: Vec<u8>,
}

pub struct SearchPicture {
    pub search: String,
}

// impl Model for PictureModel {
//     async fn init_model(conn: &ConnectionPool) -> Result<(), ModelError> {
//         let result = sqlx::query(
//             "CREATE TABLE IF NOT EXISTS PICTURE (
//                 id VARCHAR2 PRIMARY KEY,
//                 name VARCHAR2 not null,
//                 file BLOB not null,
//                 createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
//             )",
//         )
//         .execute(conn)
//         .await;

//         match result {
//             Ok(_) => Ok(()),
//             Err(err) => Err(ModelError::InitModelError(format!(
//                 "Error on init PictureModel: {err}"
//             ))),
//         }
//     }
// }

// impl Model for PlaylistModel {
//     async fn init_model(conn: &ConnectionPool) -> Result<(), ModelError> {
//         let result = sqlx::query(
//             "CREATE TABLE IF NOT EXISTS PLAYLIST (
//                 id INTEGER PRIMARY KEY,
//                 pictureOrder INTEGER NOT NULL,
//                 createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
//                 pictureId INTEGER,
//                 FOREIGN KEY(pictureId) REFERENCES PICTURE(id)
//             )",
//         )
//         .execute(conn)
//         .await;

//         match result {
//             Ok(_) => Ok(()),
//             Err(err) => {
//                 println!("{:?}", err);
//                 Err(ModelError::InitModelError(format!(
//                     "Error on init Paylist: {err}"
//                 )))
//             }
//         }
//     }
// }
