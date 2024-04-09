use std::{fs, path::{Path, PathBuf}};

use crate::models::wallpaper::Wallpaper;

#[derive(Debug)]
pub enum FileError {
    IoError(std::io::Error),
}

impl From<std::io::Error> for FileError {
    fn from(err: std::io::Error) -> Self {
        FileError::IoError(err)
    }
}


pub fn get_image_files(path: &str) -> Result<Vec<Wallpaper>, FileError> {
    let entries = fs::read_dir(path)?;

    let mut files: Vec<Wallpaper> = Vec::new();

    for entry in entries {
        let file_entry = entry?;
        let file_path = file_entry.path();

        if file_path.is_file() && is_image_file(&file_path) {
            if let (Some(path_str), Some(filename)) = (file_entry.path().to_str(), file_entry.file_name().to_str()) {
                files.push(Wallpaper {
                    filename: String::from(filename),
                    path: String::from(path_str)
                });
            }
        }
    }

    Ok(files)
}

fn is_image_file(path: &Path) -> bool {
    if let Some(extension) = path.extension().and_then(|e| e.to_str()) {
        return matches!(
            extension.to_lowercase().as_str(),
            "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "tiff" | "svg" | "heic"
        );
    }
    false
}


pub fn shorten_documents_path(full_path: String) -> Option<String> {
    let documents_dir = dirs::document_dir()?;
    let documents_path = PathBuf::from(&full_path);
    let relative_path = documents_path.strip_prefix(documents_dir).ok()?;
    Some(relative_path.to_string_lossy().to_string())
}
