use serde::{Deserialize, Serialize};
use std::{fs::{self, File}, io::Write};
use toml;

const CONFIG_PATH: &str = "./generated-config.toml";

const DEFAULT_CONFIG: Config = Config {
    picture_config: PictureConfig {
        current_picture: None,
        playlist_enable: false,
        playlist_time: 0,
    }
}; 


#[derive(Deserialize, Serialize, Debug)]
pub struct Config {
    picture_config: PictureConfig,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct PictureConfig {
    current_picture: Option<String>,
    playlist_enable: bool,
    playlist_time: u64,
}

impl Config {
    pub fn set_picture(&mut self, picture_id: String) {
        self.picture_config.current_picture = Some(picture_id);
        self.persist_config();
    }

    fn persist_config(&self){
        let toml_str = toml::to_string_pretty(self).expect("Failed to serialize to TOML");
        let mut file = File::create(CONFIG_PATH).expect("Failed to create file");

        file.write_all(toml_str.as_bytes()).expect("Failed to write to file");
    }

    pub fn load_config() -> Self {
        match fs::read_to_string(CONFIG_PATH){
            Ok(raw_content) => {
                match toml::from_str(&raw_content) {
                    Ok(loaded_config) => {
                        println!("[CONFIG] Config loaded");
                        loaded_config
                    },
                    // Handle the `error` case.
                    Err(_) => {
                        println!("[CONFIG] Error on deserializing config. Using default config");
                        DEFAULT_CONFIG
                    }
                }
            },
            Err(_) => {
                println!("[CONFIG] Error reding config file. Using default config");

                DEFAULT_CONFIG
            },
        }
    }
}