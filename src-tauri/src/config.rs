use serde::{Deserialize, Serialize};
use std::{fs::{self, File}, io::Write};
use toml;


const CONFIG_PATH: &str = "./generated-config.toml";


pub enum ConfigError {
    DuplicatedPicture(String)
}
 


#[derive(Deserialize, Serialize, Debug)]
pub struct ConfigService {
    picture_config: PictureConfig,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PictureConfig {
    folder_dir: String,
    current_picture: Option<String>,
    playlist_enable: bool,
    playlist_time: u64,
    playlist: Vec<String>
}

impl ConfigService {
    pub fn set_picture(&mut self, picture_id: &str) {
        self.picture_config.current_picture = Some(String::from(picture_id));
        self.persist_config();
    }

    fn persist_config(&self){
        let toml_str = toml::to_string_pretty(self).expect("Failed to serialize to TOML");
        let mut file = File::create(CONFIG_PATH).expect("Failed to create file");

        file.write_all(toml_str.as_bytes()).expect("Failed to write to file");
    }

    pub fn add_to_playlist(&mut self, picture_name: &str) -> Result<(), ConfigError>{
        let playlist = &self.picture_config.playlist;
        let exist_picture = playlist.iter().find(|name| **name == picture_name);

        if let Some(picture) = exist_picture {
            return Err(ConfigError::DuplicatedPicture(format!("Duplicated {picture}")))
        }

        self.picture_config.playlist.push(String::from("picture_name"));

        self.persist_config();

        Ok(())
    }

    pub fn dir_path(&self) -> &str {
        &self.picture_config.folder_dir
    }

    pub fn change_folder_dir(&mut self, new_dir: &str){
        self.picture_config.folder_dir = String::from(new_dir);
        self.persist_config();
    }

    pub fn load_config() -> Self {
        match fs::read_to_string(CONFIG_PATH){
            Ok(raw_content) => {
                match toml::from_str(&raw_content) {
                    Ok(loaded_config) => {
                        println!("[CONFIG] Config loaded");

                        loaded_config
                    },
                    Err(_) => {
                        println!("[CONFIG] Error on deserializing config. Using default config");
                        ConfigService::default_config()
                    }
                }
            },
            Err(_) => {
                println!("[CONFIG] Error reading config file. Using default config");

                ConfigService::default_config()
            },
        }
    }

    fn default_config() -> Self {
        ConfigService {
            picture_config: PictureConfig {
                folder_dir: String::from("/Users/andresvelasco/Documents/pictures/wallpapers"),
                current_picture: None,
                playlist_enable: false,
                playlist_time: 30,
                playlist: vec![],
            }
        }
    }

    
}

