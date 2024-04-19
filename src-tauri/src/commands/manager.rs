use crate::{models::config::ExtendedWallpaperConfig, state::AppState, utils};
use notify::{Config, RecommendedWatcher, RecursiveMode, Watcher};
use serde::Serialize;
use std::{
    path::Path,
    sync::{mpsc::channel, Arc},
};

#[derive(Clone, Serialize)]
struct EventPayload<T> {
    message: String,
    data: T,
}

#[tauri::command]
pub fn set_wallpaper(picture_path: String, state: tauri::State<AppState>) {
    let config = Arc::clone(&state.0);
    let mut config_guard = config.write().unwrap();

    config_guard.set_wallpaper(picture_path);
}

#[tauri::command]
pub fn change_folder(window: tauri::Window, dir: String, state: tauri::State<AppState>) {
    let config = Arc::clone(&state.0);
    let mut write_config = config.write().unwrap();

    write_config.set_folder_dir(&dir);

    window
        .emit(
            "files",
            EventPayload {
                message: String::from("Loaded files"),
                data: utils::get_image_files(&dir).unwrap(),
            },
        )
        .unwrap();
}

#[tauri::command]
pub fn get_wallpaper_config(state: tauri::State<AppState>) -> ExtendedWallpaperConfig {
    let config = Arc::clone(&state.0);
    let config_guard = config.read().unwrap();

    config_guard.get_expanded_config()
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
            let path_from_config = config_guard.get_picture_config().folder_dir;

            let change_watcher_dir = !current_path.eq(&path_from_config) && is_watching;
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

#[tauri::command]
pub fn listen_playlist(window: tauri::Window, state: tauri::State<AppState>) {
    let config_lock: Arc<std::sync::RwLock<crate::models::manager::WallpaperConfigManager>> = Arc::clone(&state.0);

    std::thread::spawn(move || loop {
        // get config -> folder, current_picture
        let mut config_guard: std::sync::RwLockWriteGuard<'_, crate::models::manager::WallpaperConfigManager> = config_lock.write().unwrap();

        if !config_guard.get_picture_config().playlist_enable {
            continue;
        }

        // if playlist enable continue
        let time = config_guard.get_picture_config().playlist_time;
        let current_picture = config_guard.get_picture_config().current_picture;
        let current_dir = config_guard.get_picture_config().folder_dir;

        let files = utils::get_image_files(&current_dir).unwrap_or_default();
        let folder_size = files.len();

        let current_index = files
            .iter()
            .position(|wallpaper| wallpaper.path == current_picture)
            .unwrap();

        let mut next_index = current_index + 1;

        if next_index >= folder_size - 1 {
            next_index = 0;
        }

        let current_wallpaper = match files.get(next_index)  {
            Some(wallpaper) => wallpaper,
            None => files.first().unwrap(),
        };

        config_guard.set_wallpaper(current_wallpaper.path.clone());
        std::mem::drop(config_guard);

        window
            .emit(
                "wallpaper",
                EventPayload {
                    message: String::from("wallpaper updated"),
                    data: current_wallpaper,
                },
            )
            .unwrap();

        std::thread::sleep(std::time::Duration::from_secs(time));
    });
}

#[tauri::command]
pub fn change_playlist_settings(playlist_time: u64, playlist_enable: bool, state: tauri::State<AppState>) {
    let config_lock = Arc::clone(&state.0);

    let mut config_guard = config_lock.write().unwrap();

    config_guard.set_playlist_enable(playlist_enable);
    config_guard.set_playlist_time(playlist_time);
}
