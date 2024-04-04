use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};


#[derive(Deserialize, Debug, Clone, sqlx::FromRow, Serialize)]
#[sqlx(rename_all = "camelCase")]

pub struct Picture {
    pub id: i64,
    pub name: String,
    pub file_blob: Vec<u8>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone, sqlx::FromRow, Serialize)]
#[sqlx(rename_all = "camelCase")]

pub struct Playlist {
    pub id: i64,
    pub picture_id: String,
    pub picture_order: i64,

    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone, sqlx::FromRow, Serialize)]
#[sqlx(rename_all = "camelCase")]

pub struct PopulatedPlaylist {
    pub id: i64,
    pub picture_name: String,
    pub picture_file: Vec<u8>,
    pub picture_order: i64,

    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Deserialize, Debug, Clone)]

pub struct CreatePlaylistItem {
    pub picture_id: i64,
    pub order: i64,
}

#[derive(Deserialize, Debug, Clone)]

pub struct CreateUpdatePicture {
    pub name: String,
    pub file: Vec<u8>,
}

pub struct SearchPicture {
    pub search: Option<String>,
}