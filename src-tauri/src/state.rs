use crate::config::ConfigService;
use crate::picture::services::PictureService;

pub struct AppState {
    pub config_service: ConfigService,
    pub picture_service: PictureService
}
