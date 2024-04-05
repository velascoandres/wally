use serde_derive::Serialize;

pub enum RepositoryError {
    CreateError(String),
    UpdateError(String),
    FindError(String),
    RemoveError(String),
    NotFoundError(String)
}

#[derive(Debug, Serialize)]
pub struct FindResponse<T>{
    pub data: Vec<T>,
    pub total: u64,
}


pub trait Repository<T, C = Self, U = Self, Q = Self> {
    async fn create(&mut self, created_body: C) -> Result<T, RepositoryError>;
    async fn update(&mut self, id: i64, update_body: U) -> Result<T, RepositoryError>;

    async fn remove(&mut self, id: i64) -> Result<i64, RepositoryError>;

    async fn find_by_id(&self, id: i64) -> Result<T, RepositoryError>;
    async fn find_many(&self, query: Option<Q>) -> Result<FindResponse<T>, RepositoryError>;
}
