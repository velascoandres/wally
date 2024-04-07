use std::{fs::{self, File}, io::Write};
use serde::{Deserialize, Serialize};
use toml;

const CONFIG_PATH: &str = "./generated_config.toml";


#[derive(Deserialize, Serialize, Debug, Default)]
pub struct PictureConfig {
    // picture setted as wallpaper
    current_picture: Option<String>,
    // if wallpaper playlist is enable
    playlist_enable: bool,
    // time to wait of change the next wallpaper from the playlist
    // the time is in seconds [+integers only]
    playlist_time: u64,
    // folder or dir where the image files are
    folder_dir: String
}

#[derive(Debug, Serialize, Deserialize, Default)]

pub struct AppConfig {
    pub picture_config: PictureConfig
}

impl AppConfig {

    // save the configuration in a toml file
    fn persist_config(&self){
        let toml_str = toml::to_string_pretty(self).expect("Failed to serialize to TOML");
        let mut file = File::create(CONFIG_PATH).expect("Failed to create file");

        file.write_all(toml_str.as_bytes()).expect("Failed to write to file");
    }

    // load the configuration form the toml file
    pub fn from_file() -> Self {
        match fs::read_to_string(CONFIG_PATH){
            Ok(raw_content) => {
                match toml::from_str(&raw_content) {
                    Ok(loaded_config) => {
                        println!("[CONFIG] Config loaded");
                        loaded_config
                    },
                    Err(_) => {
                        println!("[CONFIG] Error on deserializing config. Using default config");
                        AppConfig::default()
                    }
                }
            },
            Err(_) => {
                println!("[CONFIG] Error reading config file. Using default config");

                AppConfig::default()
            },
        }
    }
    // Each config update must be persisted
    pub fn set_current_picture(&mut self, current_picture: Option<String>){
        self.picture_config.current_picture = current_picture;
        self.persist_config();
    }

    pub fn set_playlist_enable(&mut self, playlist_enable: bool){
        self.picture_config.playlist_enable = playlist_enable;
        self.persist_config();
    }

    pub fn set_playlist_time(&mut self, playlist_time: u64){
        self.picture_config.playlist_time = playlist_time;
        self.persist_config();
    }

    pub fn set_folder_dir(&mut self, folder_dir: &str){
        self.picture_config.folder_dir = String::from(folder_dir);
        self.persist_config();
    }


    pub fn get_current_picture(&self) -> &Option<String>{
        &self.picture_config.current_picture
    }

    pub fn get_playlist_enable(&self) -> &bool{
        &self.picture_config.playlist_enable
    }

    pub fn get_playlist_time(&self) -> &u64{
        &self.picture_config.playlist_time
    }

    pub fn get_folder_dir(&self) -> &String{
        &self.picture_config.folder_dir
    }
}