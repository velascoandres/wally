use std::{path::Path, sync::{mpsc::channel, Arc}};

use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};

use crate::state::AppState;

#[tauri::command]
pub fn change_dir(dir: String, state: tauri::State<AppState>) {
    let config = Arc::clone(&state.0);

    let mut write_config = config.write().unwrap();

    write_config.set_folder_dir(&dir);
    println!("[CONFIG] file dir changed: {}", dir);
}

#[tauri::command]
pub fn listen_folder(state: tauri::State<AppState>) {
    let config_lock = Arc::clone(&state.0);

    std::thread::spawn(move || {
        let (sender, receiver) = channel();
        let mut watcher: RecommendedWatcher = Watcher::new(sender, Config::default()).unwrap();
        let mut is_watching = false;
        let mut current_path = String::default();

        loop {
            let config_guard = config_lock.read().unwrap();
            let path_from_config = config_guard.get_folder_dir().clone();

            let change_watcher_dir = !current_path.eq(&path_from_config.clone()) && is_watching;
            let is_first_watching = !is_watching;

            if is_first_watching {
                is_watching = true;
            } else if change_watcher_dir {
                watcher.unwatch(Path::new(&current_path)).unwrap();
            }

            current_path = path_from_config; 

            watcher.watch(Path::new(&current_path), RecursiveMode::NonRecursive).unwrap();
            println!("Listening: {}", current_path);

            std::mem::drop(config_guard);

            match receiver.recv_timeout(std::time::Duration::from_secs(1)) {
                Ok(event) => {
                    println!("Event: {:?}", event);
                }
                Err(e) => {
                    println!("Error: {:?}", e);
                }
            };

            // std::thread::sleep(std::time::Duration::from_secs(1));
        }
    });
}
