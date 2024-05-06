use std::path::Path;

use serde::{Deserialize, Serialize};

#[derive(Clone, Serialize, Debug)]
pub struct Folder {
    pub dirname: String,
    pub path: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct WallpaperConfig {
    pub current_picture: String,
    pub playlist_enable: bool,
    pub playlist_time: u64,
    pub folder_dir: String,
}

#[derive(Serialize, Debug, Clone)]
pub struct ExtendedWallpaperConfig {
    pub current_picture: String,
    pub playlist_enable: bool,
    pub playlist_time: u64,
    pub contained_folder: Folder,
}

impl WallpaperConfig {
    pub fn get_folder_detail(&self) -> Folder {
        let path = Path::new(&self.folder_dir);
        let dirname = path.file_name().unwrap().to_str().unwrap();

        Folder {
            dirname: String::from(dirname),
            path: self.folder_dir.clone(),
        }
    }
}
