use dotenv::dotenv;
use std::env;

pub mod _conn;
pub mod database;

pub trait UrlMethods {
    fn generates_code(&self) -> String;
    fn obtain_transferred_data_by_code(&self, code: &str) -> String;
    fn remove_code(&self, code: &str) -> String;
}

#[derive(Clone)]
pub struct UrlSettings {
    pub url: String,
}

impl UrlMethods for UrlSettings {
    fn generates_code(&self) -> String {
        format!("{}/api/dataTransfer/generatesCode", self.url)
    }

    fn obtain_transferred_data_by_code(&self, code: &str) -> String {
        format!(
            "{}/api/dataTransfer/obtainTransferredDataByCode?code={}",
            self.url, code
        )
    }

    fn remove_code(&self, code: &str) -> String {
        format!("{}/api/dataTransfer/removeCode/{}", self.url, code)
    }
}

pub fn url_settings() -> UrlSettings {
    dotenv().ok();

    let env_url = if let Ok(url) = env::var("BACKUP_URL") {
        url
    } else {
        "".to_string()
    };

    UrlSettings { url: env_url }
}
