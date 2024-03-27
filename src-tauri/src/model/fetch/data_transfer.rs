use crate::{
    config::{url_settings, UrlMethods},
    fetch::{
        self,
        data_types::{City, DBTypes, Destination, Sender, Transporter},
    },
    model::use_insert::multiple_plain_insert,
    services::{key_value_service::KeyValueStoreMethods, key_values::key_value_code},
    use_select,
    utils::Tables,
};
use fetch::methods::{delete_request_no_json, get_request, post_request, ErrorResponse};
use use_select::plain_select;

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tauri::command;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GenerateCodeParams {
    pub cities: Vec<HashMap<String, String>>,
    pub destinations: Vec<HashMap<String, String>>,
    pub senders: Vec<HashMap<String, String>>,
    pub transporters: Vec<HashMap<String, String>>,
}

#[derive(Clone, Deserialize, Serialize)]
pub struct GenerateCodeReturn {
    pub code: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DataByCodeReturn {
    pub code: String,
    #[serde(rename = "transferredIn")]
    pub transferred_in: String,
    pub _id: String,
    #[serde(rename(deserialize = "transferredData", serialize = "transferredData"))]
    pub transferred_data: DBTypes,
}

#[command]
pub async fn generate_code() -> Result<GenerateCodeReturn, ErrorResponse> {
    let d = GenerateCodeParams {
        cities: plain_select("SELECT * FROM city"),
        destinations: plain_select("SELECT * FROM destination"),
        senders: plain_select("SELECT * FROM sender"),
        transporters: plain_select("SELECT * FROM transporter"),
    };

    let url = url_settings().generates_code();

    match post_request::<GenerateCodeReturn, GenerateCodeParams>(url.as_str(), d).await {
        Ok(r) => {
            key_value_code((&*r.code).to_string()).insert_and_replace();
            Ok(r)
        }
        Err(e) => Err(e),
    }
}

#[command]
pub async fn obtain_transferred_data_by_code(
    code: &str,
) -> Result<DataByCodeReturn, ErrorResponse> {
    let url = url_settings().obtain_transferred_data_by_code(code);

    get_request::<DataByCodeReturn>(url.as_str()).await
}

#[command]
pub async fn obtain_transferred_data_by_code_and_set(code: &str) -> Result<String, ErrorResponse> {
    match obtain_transferred_data_by_code(code).await {
        Ok(data) => {
            let transferred_data = data.transferred_data;

            multiple_plain_insert::<City>(Tables::City, transferred_data.cities);
            multiple_plain_insert::<Transporter>(
                Tables::Transporter,
                transferred_data.transporters,
            );
            multiple_plain_insert::<Sender>(Tables::Sender, transferred_data.senders);
            multiple_plain_insert::<Destination>(
                Tables::Destination,
                transferred_data.destinations,
            );

            Ok(data.code)
        }
        Err(error_response) => Err(error_response),
    }
}

#[command]
pub fn get_stored_code() -> String {
    if let Ok(code) = key_value_code("_".to_string()).get() {
        code.code
    } else {
        "DESCONOCIDO".to_string()
    }
}

#[command]
pub async fn delete_data_by_code(code: &str) -> Result<(), ErrorResponse> {
    let url = url_settings().remove_code(code);

    println!("{}", &url);
    match delete_request_no_json(url.as_str()).await {
        Ok(_) => {
            key_value_code(code.to_string()).remove();
            Ok(())
        }
        Err(e) => Err(e),
    }
}
