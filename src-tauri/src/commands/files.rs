use serde::Serialize;

use crate::{state::AppState, utils};

#[derive(Debug, Serialize)]
pub struct FilePathsPayload {
    file_paths: Vec<String>
}


#[tauri::command]
pub fn get_files(state: tauri::State<AppState>) -> FilePathsPayload {
    let config_guard = state.0.read().unwrap();

    let file_dir = config_guard.get_folder_dir();
    let file_paths = utils::get_image_files(file_dir).unwrap_or_default();

    FilePathsPayload {
        file_paths
    }   
}
