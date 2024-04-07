use std::sync::Arc;

use crate::{files, state::AppState};

#[tauri::command]
pub fn change_dir(dir: String, state: tauri::State<AppState>){
    let config = Arc::clone(&state.0);

    let mut write_config = config.write().unwrap();

    write_config.set_folder_dir(&dir);
    println!("[CONFIG] file dir changed: {}", dir);
}


#[tauri::command]
pub fn listen_folder(state: tauri::State<AppState>) {
    let config_lock = Arc::clone(&state.0);


    std::thread::spawn(move || {
        let config_guard = config_lock.read().unwrap();
        let path = config_guard.get_folder_dir().clone();

        println!("Listening: {}", path);

        std::mem::drop(config_guard);

        let _ = files::listen_changes(path.as_str());
    });
}

