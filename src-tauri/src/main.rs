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
    let state = Arc::clone(&state);

    std::thread::spawn(move || {
        loop {
            let state = state.lock().unwrap();

            println!("{:?}", state.config_service.dir_path());

            //let _ = files::listen_changes(state.config_service.dir_path());
            std::thread::sleep(std::time::Duration::from_secs(1));
        }
    });
}

// #[tauri::command]
// fn listen_folder(state: tauri::State<'_, AppStateMutex>) {
//     let state = Arc::clone(&state.0);

//     std::thread::spawn(move || {
//         //let state = state.lock().unwrap();
//         let unwrapped_state = state
//             .try_lock()
//             .map_err(|_| String::from("cannot change connection while it is being used"))
//             .unwrap();

//         loop {
//             println!("{:?}", state.config_service.dir_path());

//             // let _ = files::listen_changes(cs.config_service.dir_path());
//             std::thread::sleep(std::time::Duration::from_secs(1));
//         }
//     });
// }

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .setup(move |app| {
            let app_state = AppState {
                file_repository: files::FileRepository::default(),
                config_service: ConfigService::load_config(),
            };
            app.manage(Arc::new(Mutex::new(app_state)));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::change_dir,
            listen_folder
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // observer_handle.join().unwrap();
}
