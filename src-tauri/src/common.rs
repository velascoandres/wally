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
