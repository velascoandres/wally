use std::sync::{Arc, Mutex};
use tauri::State;
use crate::state::AppState;

#[tauri::command]
pub fn change_dir(dir: String, state: State<Arc<Mutex<AppState>>>){
    let state_clone = Arc::clone(&state);

    println!("Here");

    // clone.lock().unwrap().config_service.change_folder_dir(dir.as_str());

    let mut locked_state = match state_clone.lock() {
        Ok(guard) => guard,
        Err(_) => {
            println!("Mutex is poisoned, skipping...");
            return; // Salimos de la función si el mutex está en un estado de error
        }
    };

    locked_state.config_service.change_folder_dir(&dir);
    println!("[CONFIG] file dir changed: {}", dir);
}


