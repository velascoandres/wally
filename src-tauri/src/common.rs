pub enum RepositoryError {
    CreateError(String),
    UpdateError(String),
    FindError(String),
    RemoveError(String)
}

pub struct FindReponse<T>{
    pub data: Vec<T>,
    pub total: u64,
}

// pub trait Model {
//     fn init_model(conn: &ConnectionPool) -> impl std::future::Future<Output = Result<(), ModelError>> + Send;
// }