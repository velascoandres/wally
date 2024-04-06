// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

use tauri::Manager;
use wally::config::ConfigService;
use wally::state::AppState;
use wally::{commands, files};

pub struct AppStateMutex(pub Arc<Mutex<AppState>>);


#[tauri::command]
fn listen_folder(state: tauri::State<Arc<Mutex<AppState>>>) {
    let cloned_state = Arc::clone(&state);

    std::thread::spawn(move || {
        let state = cloned_state.lock().unwrap();
        let path = state.config_service.dir_path();

        println!("Listening: {}", path);

        std::mem::drop(state);

        let _ = files::listen_changes(&path);
    });
}


#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            app.manage(Arc::new(Mutex::new(AppState {
                file_repository: files::FileRepository::default(),
                config_service: ConfigService::load_config(),
            })));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            listen_folder,
            commands::change_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // observer_handle.join().unwrap();
}
