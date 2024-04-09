use crate::{state::AppState, utils};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::{path::Path, sync::{mpsc::channel, Arc}};

#[derive(Clone, Serialize)]
struct EventPayload<T> {
    message: String,
    data: T,
}

#[tauri::command]
pub fn change_folder(window: tauri::Window, dir: String, state: tauri::State<AppState>) {
    let config = Arc::clone(&state.0);

    let mut write_config = config.write().unwrap();

    write_config.set_folder_dir(&dir);
    println!("[CONFIG] file dir changed: {}", dir);

    let files = utils::get_image_files(&dir).unwrap();

    window
        .emit(
            "files",
            EventPayload {
                message: String::from("Loaded files"),
                data: files,
            },
        )
        .unwrap();
}

#[tauri::command]
pub fn get_current_dir(state: tauri::State<AppState>) -> String {
    let config = Arc::clone(&state.0);

    let config_guard = config.read().unwrap();

    let current_dir = config_guard.get_folder_dir();

    utils::shorten_documents_path(current_dir.clone()).unwrap()
}

#[tauri::command]
pub fn init_listen(window: tauri::Window, state: tauri::State<AppState>) {
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

            watcher
                .watch(Path::new(&current_path), RecursiveMode::NonRecursive)
                .unwrap();

            std::mem::drop(config_guard);

            if let Ok(event) = receiver.recv_timeout(std::time::Duration::from_secs(1)) {
                println!("Event: {:?}", event.unwrap());
                let files = utils::get_image_files(&current_path).unwrap();
                
                window
                    .emit(
                        "files",
                        EventPayload {
                            message: String::from("Loaded files"),
                            data: files,
                        },
                    )
                    .unwrap();
            }
        }
    });
}
