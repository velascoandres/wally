use super::config::{ExtendedWallpaperConfig, WallpaperConfig};
use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::Write,
};
use toml;
use wallpaper;

#[derive(Debug, Serialize, Deserialize)]
pub struct WallpaperConfigManager {
    config_path: String,
    wallpaper_config: WallpaperConfig,
}

impl Default for WallpaperConfig {
    fn default() -> Self {
        Self {
            playlist_enable: Default::default(),
            playlist_time: Default::default(),
            current_picture: wallpaper::get().unwrap(),
            folder_dir: String::from(dirs::document_dir().unwrap().to_str().unwrap()),
        }
    }
}

impl WallpaperConfigManager {
    fn persist_config(&self) {
        let toml_str = toml::to_string_pretty(self).expect("Failed to serialize to TOML");
        let mut file = File::create(&self.config_path).expect("Failed to create file");

        file.write_all(toml_str.as_bytes())
            .expect("Failed to write to file");
    }

    pub fn set_wallpaper(&mut self, wallpaper_path: String) {
        wallpaper::set_from_path(&wallpaper_path).unwrap();

        self.wallpaper_config.current_picture = wallpaper_path;
        self.persist_config();
    }

    pub fn set_playlist_enable(&mut self, playlist_enable: bool) {
        self.wallpaper_config.playlist_enable = playlist_enable;
        self.persist_config();
    }

    pub fn set_playlist_time(&mut self, playlist_time: u64) {
        self.wallpaper_config.playlist_time = playlist_time;
        self.persist_config();
    }

    pub fn set_folder_dir(&mut self, folder_dir: &str) {
        self.wallpaper_config.folder_dir = String::from(folder_dir);
        self.persist_config();
    }

    pub fn get_picture_config(&self) -> WallpaperConfig {
        self.wallpaper_config.clone()
    }

    pub fn get_expanded_config(&self) -> ExtendedWallpaperConfig {
        ExtendedWallpaperConfig {
            current_picture: self.wallpaper_config.current_picture.clone(),
            playlist_enable: self.wallpaper_config.playlist_enable,
            playlist_time: self.wallpaper_config.playlist_time,
            contained_folder: self.wallpaper_config.get_folder_detail(),
        }
    }

    pub fn from_file_path(config_path: &str) -> Self {
        let default_config = WallpaperConfigManager {
            config_path: String::from(config_path),
            wallpaper_config: WallpaperConfig::default(),
        };

        let config_file_result = fs::read_to_string(config_path);

        if config_file_result.is_err(){
            println!("[CONFIG] Error reading config file. Using default config");
            return default_config;
        }

        match toml::from_str(&config_file_result.unwrap()) {
            Ok(loaded_config) => {
                println!("[CONFIG] Config loaded");
                loaded_config
            }
            Err(_) => {
                println!("[CONFIG] Error on deserializing config. Using default config");
                default_config
            }
        }
    }
}
