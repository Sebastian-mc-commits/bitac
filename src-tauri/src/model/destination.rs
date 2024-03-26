use std::collections::HashMap;

use crate::model::use_select::{use_select, CustomQueryParams, SelectParams};
use crate::utils::Tables;
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Destination {
    nit: String,
    name: String,
    city_id: usize,
    sender_id: String,
    phone_number: String,
    location_description: String,
    is_favorite: u8,
}

impl Destination {
    fn new() -> Self {
        Self {
            city_id: 0,
            is_favorite: 0,
            location_description: "".to_string(),
            name: "".to_string(),
            nit: "".to_string(),
            phone_number: "".to_string(),
            sender_id: "".to_string(),
        }
    }

    pub fn obtain_destination_details(
        w: Option<HashMap<String, HashMap<String, String>>>,
    ) -> Result<Vec<HashMap<String, String>>, String> {
        let params = SelectParams {
            custom_query: Some(CustomQueryParams {
                values: String::from("n.*, c.id AS cityId, c.name AS city"),
                join_into: String::from("INNER JOIN city c ON c.id = n.cityId"),
            }),
            table: Tables::Destination,
            w,
        };

        use_select(params)
    }
}

#[command]
pub fn obtain_destination_details(
    w: Option<HashMap<String, HashMap<String, String>>>,
) -> Result<Vec<HashMap<String, String>>, String> {
    Destination::obtain_destination_details(w)
}
