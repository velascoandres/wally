use std::sync::{Arc, RwLock};

use crate::models::manager::WallpaperConfigManager;

pub struct AppState(pub Arc<RwLock<WallpaperConfigManager>>);