use std::borrow::{Borrow, BorrowMut};

use serde::{de::DeserializeOwned, Deserialize, Serialize};

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct ErrorResponse {
    pub message: String,
    pub http_status_code: u16,
    pub custom_message: String,
}

pub async fn get_request<T>(url: &str) -> Result<T, ErrorResponse>
where
    T: DeserializeOwned + Serialize,
{
    let resp = reqwest::get(url).await.map_err(|e| ErrorResponse {
        custom_message: String::from("Error inesperado"),
        http_status_code: 500,
        message: e.to_string(),
    })?;

    let status_code = resp.status().as_u16();

    match resp.json::<T>().await {
        Err(e) => {
            let error_response = ErrorResponse {
                custom_message: String::from("Error inesperado"),
                http_status_code: status_code,
                message: e.to_string(),
            };

            Err(error_response)
        }

        Ok(res) => Ok(res),
    }
}

pub async fn post_request<T, R>(url: &str, data: R) -> Result<T, ErrorResponse>
where
    T: DeserializeOwned + Serialize,
    R: Serialize,
{
    let error_case = |e: reqwest::Error| ErrorResponse {
        custom_message: String::from("Error inesperado"),
        http_status_code: 500,
        message: e.to_string(),
    };

    let client = reqwest::Client::new();
    let json_data = serde_json::to_string(&data).unwrap();

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .body(json_data)
        .send()
        .await
        .map_err(error_case);

    match response?.json::<T>().await {
        Err(e) => Err(error_case(e)),

        Ok(res) => Ok(res),
    }
}
