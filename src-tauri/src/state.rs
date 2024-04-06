use crate::{config::ConfigService, files::FileRepository};

pub struct AppState {
    pub config_service: ConfigService,
    pub file_repository: FileRepository
}
