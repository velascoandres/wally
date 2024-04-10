// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, RwLock};

use tauri::Manager;
use wally::{commands, models::manager::WallpaperConfigManager, state::AppState};


fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            app.manage(AppState(Arc::new(RwLock::new(WallpaperConfigManager::from_file()))));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::manager::init_listen,
            commands::manager::change_folder,
            commands::manager::get_wallpaper_config,
            commands::manager::set_wallpaper,
            commands::files::get_files,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
