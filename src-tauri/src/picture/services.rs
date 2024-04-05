use std::sync::Arc;
use crate::common::{FindResponse, Repository, RepositoryError};
use crate::config::ConfigService;
use crate::picture::models::{CreateUpdatePicture, Picture, SearchPicture};

pub struct PictureService {
    repository: Arc<&'static dyn Repository<Picture>>,
    config_service: Arc<&'static ConfigService>,
}

impl PictureService {
    pub fn new(repository: &'static dyn Repository<Picture>, config_service: &'static ConfigService) -> Self {
        PictureService {
            repository: Arc::new(repository),
            config_service: Arc::new(config_service)
        }
    }

    pub fn create_picture(&mut self, create_picture: CreateUpdatePicture) -> Result<Picture, RepositoryError>{
        self.repository.create(create_picture)
    }

    pub fn update_picture(&mut self, id: i64, update_picture: CreateUpdatePicture) -> Result<Picture, RepositoryError>{
        self.repository.update(id, update_picture)
    }

    pub fn remove_picture(&mut self, id: i64) -> Result<i64, RepositoryError>{
        self.repository.remove(id)
    }

    pub fn find_pictures(&self, query: SearchPicture) -> Result<FindResponse<Picture>, RepositoryError>{
        self.repository.find_many(Some(query))
    }

    pub async fn set_desktop_picture(&mut self, id: i64) -> Result<Picture, RepositoryError>{
        let picture_result = self.repository.find_by_id(id).await;

        match picture_result {
            Ok(picture) => {
                let _ = self.config_service.set_picture(id);

                Ok(picture)
            }
            Err(err) => Err(err)
        }

    }
}