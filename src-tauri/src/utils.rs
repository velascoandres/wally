use std::{fs, path::Path};

#[derive(Debug)]
pub enum FileError {
    IoError(std::io::Error),
}

impl From<std::io::Error> for FileError {
    fn from(err: std::io::Error) -> Self {
        FileError::IoError(err)
    }
}


pub fn get_image_files(path: &str) -> Result<Vec<String>, FileError> {
    let entries = fs::read_dir(path)?;

    let mut files_path = Vec::new();

    for entry in entries {
        let file_entry = entry?;

        let file_path = file_entry.path();

        if file_path.is_file() && is_image_file(&file_path) {
            if let Some(path_str) = file_path.as_path().to_str() {
                println!("loaded filename: {}", path_str);
                files_path.push(String::from(path_str));
            }
        }
    }

    Ok(files_path)
}

fn is_image_file(path: &Path) -> bool {
    if let Some(extension) = path.extension().and_then(|e| e.to_str()) {
        return matches!(
            extension.to_lowercase().as_str(),
            "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "tiff" | "svg"
        );
    }
    false
}