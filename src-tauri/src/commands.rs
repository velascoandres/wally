use std::sync::{Arc, Mutex};
use tauri::State;
use crate::state::AppState;

#[tauri::command]
pub fn change_dir(dir: String, state: State<Arc<Mutex<AppState>>>){
    println!("[CONFIG] file dir changed: {}", dir);

    state.lock().unwrap().config_service.change_folder_dir(dir.as_str());
}


