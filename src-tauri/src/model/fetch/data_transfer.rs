use crate::{
    config::{url_settings, UrlMethods},
    fetch::{
        self,
        data_types::{City, DBTypes, Destination, Sender, Transporter},
    },
    model::use_insert::multiple_plain_insert,
    use_select,
    utils::Tables,
};
use fetch::methods::{get_request, post_request, ErrorResponse};
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

    post_request::<GenerateCodeReturn, GenerateCodeParams>(url.as_str(), d).await
}

#[command]
pub async fn obtain_transferred_data_by_code(
    code: &str,
) -> Result<DataByCodeReturn, ErrorResponse> {
    let url = url_settings().obtain_transferred_data_by_code(code);

    println!("{}", &url);

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

// #[command]
// pub async fn get_data_and_set() -> Result<String, ErrorResponse> {
//     match generate_code().await {
//         Ok(cd) => {
//             let code = cd.code;

//             obtain_transferred_data_by_code_and_set(code.as_str()).await
//         }
//         Err(error_response) => Err(error_response)
//     }
// }
