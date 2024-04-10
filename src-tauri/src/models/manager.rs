use serde::{Deserialize, Serialize};
use std::{
    fs::{self, File},
    io::Write,
};
use toml;
use wallpaper;

use super::config::{ExtendedWallpaperConfig, WallpaperConfig};

const CONFIG_PATH: &str = "./generated_config.toml";


#[derive(Debug, Serialize, Deserialize, Default)]

pub struct WallpaperConfigManager {
    picture_config: WallpaperConfig,
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
        let mut file = File::create(CONFIG_PATH).expect("Failed to create file");

        file.write_all(toml_str.as_bytes())
            .expect("Failed to write to file");
    }

    pub fn set_wallpaper(&mut self, wallpaper_path: String) {
        println!("[WALLPAPER]: {}", wallpaper_path);
        wallpaper::set_from_path(&wallpaper_path).unwrap();

        self.picture_config.current_picture = wallpaper_path;
        self.persist_config();
    }

    pub fn set_playlist_enable(&mut self, playlist_enable: bool) {
        self.picture_config.playlist_enable = playlist_enable;
        self.persist_config();
    }

    pub fn set_playlist_time(&mut self, playlist_time: u64) {
        self.picture_config.playlist_time = playlist_time;
        self.persist_config();
    }

    pub fn set_folder_dir(&mut self, folder_dir: &str) {
        self.picture_config.folder_dir = String::from(folder_dir);
        self.persist_config();
    }

    pub fn get_picture_config(&self) -> WallpaperConfig {
        self.picture_config.clone()
    }

    pub fn get_expanded_config(&self) -> ExtendedWallpaperConfig {

        ExtendedWallpaperConfig {
            current_picture: self.picture_config.current_picture.clone(),
            playlist_enable: self.picture_config.playlist_enable,
            playlist_time: self.picture_config.playlist_time,
            contained_folder: self.picture_config.get_folder_detail(),
        }

    }

    pub fn from_file() -> Self {
        match fs::read_to_string(CONFIG_PATH) {
            Ok(raw_content) => match toml::from_str(&raw_content) {
                Ok(loaded_config) => {
                    println!("[CONFIG] Config loaded");
                    loaded_config
                }
                Err(_) => {
                    println!("[CONFIG] Error on deserializing config. Using default config");
                    WallpaperConfigManager::default()
                }
            },
            Err(_) => {
                println!("[CONFIG] Error reading config file. Using default config");

                WallpaperConfigManager::default()
            }
        }
    }
}
