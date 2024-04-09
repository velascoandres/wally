use serde::Serialize;

use crate::{models::wallpaper::Wallpaper, state::AppState, utils};

#[derive(Debug, Serialize)]
pub struct FilePathsPayload {
    files: Vec<Wallpaper>
}


#[tauri::command]
pub fn get_files(state: tauri::State<AppState>) -> FilePathsPayload {
    let config_guard = state.0.read().unwrap();

    let file_dir = config_guard.get_folder_dir();
    let files = utils::get_image_files(file_dir).unwrap_or_default();

    FilePathsPayload {
        files
    }   
}
