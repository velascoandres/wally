// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, RwLock};

use tauri::Manager;
use wally::{commands, models::app_config::AppConfig, state::AppState};


#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            app.manage(AppState(Arc::new(RwLock::new(AppConfig::from_file()))));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::folder::init_listen,
            commands::folder::change_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
