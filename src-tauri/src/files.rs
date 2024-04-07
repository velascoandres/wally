use notify::{Config, RecommendedWatcher, RecursiveMode, Result as NotifyResult, Watcher};
use std::{fs, path::Path, sync::mpsc::channel};

pub enum FileError {
    FileEntryError(String),
    LoadFiles(String)
}

pub struct FileRepository {
    pub file_paths: Vec<String>
}

impl FileRepository {
    pub fn new()-> Self {
        FileRepository {
            file_paths: vec![]
        }
    }

    pub fn clean_paths(&mut self){
        self.file_paths = vec![];
    }

    pub fn add_path(&mut self, path: &str){
        self.file_paths.push(String::from(path));
    }
}

impl Default for FileRepository {
    fn default() -> Self {
        Self::new()
    }
}

pub fn load_files(path: &str) -> Result<Vec<String>, FileError>{
    let entries_result = fs::read_dir(path);

    let mut files_path: Vec<String> = vec![];

    match entries_result {
        Ok(entries) => {
            for file_entry in entries {
                match file_entry {
                    Ok(file) => {
                        let file_path = file.path();

                        if file_path.is_file() && is_image_file(&file_path) {

                            let path_str = file_path.as_path().to_str().unwrap();

                            println!("loaded: {}", path_str);

                            files_path.push(String::from(path_str));
                            
                        }
                    },
                    Err(err) => {
                        println!("Error on reading {:?}", err);
                    },
                }
                
            }
            Ok(files_path)
        },
        Err(err) => {
            Err(FileError::LoadFiles(format!("{err}")))
        },
    }
}

pub fn listen_changes(path: &str) -> NotifyResult<()>{
    let (sender, receiver) = channel();
    let mut watcher: RecommendedWatcher = Watcher::new(sender, Config::default())?;

    let dir_path = Path::new(path);

    watcher.watch(dir_path, RecursiveMode::Recursive).unwrap();

    for rev in receiver {
        println!("Watching '{:?}'", path);

        match rev {
            Ok(event) => {
                println!("Event: {:?}", event);
            }
            Err(e) => {
                println!("Error: {:?}", e);
            },
        }
    }

    Ok(())
}


fn is_image_file(path: &Path) -> bool {
    if let Some(extension) = path.extension() {
        if let Some(ext_str) = extension.to_str() {
            match ext_str.to_lowercase().as_str() {
                "jpg" | "jpeg" | "png" | "gif" | "bmp" | "webp" | "tiff" | "svg" => return true,
                _ => return false,
            }
        }
    }
    false
}