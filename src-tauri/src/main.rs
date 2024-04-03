// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use wally::{config::Config, db, picture};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() {
    let mut config = Config::load_config();

    config.set_picture(String::from("test_id"));

    let db_conn = db::get_pool("sqlite://wally.db").await.unwrap();

    let _ = db::load_model(&db_conn, "PICTURE", picture::sql::PICTURE_TABLE_SQL).await;
    let _ = db::load_model(&db_conn, "PLAYLIST", picture::sql::PLAYLIST_TABLE_SQL).await;

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
