use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct Wallpaper {
    pub filename: String,
    pub path: String
}