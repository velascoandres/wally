
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate dotenv_codegen;
extern crate dotenv;

use wally::{config::ConfigService, db};
use wally::picture::{repositories, services};
use wally::state::AppState;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() {
    let connection_url = dotenv!("DATABASE_URL");

    let config_service = ConfigService::load_config();

    let conn = db::get_pool(connection_url).await.unwrap();

    let picture_repository = repositories::PictureRepository::new(&conn);
    // let playlist_repository = repositories::PlaylistRepository::new(&conn);

    let picture_service = services::PictureService::new(&picture_repository, &config_service);

    let state = AppState {
        picture_service,
        config_service
    };

    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
