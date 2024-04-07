use std::sync::{Arc, RwLock};

use crate::models::app_config::AppConfig;

pub struct AppState(pub Arc<RwLock<AppConfig>>);
