use crate::{config, model, utils};
use std::collections::HashMap;

use config::_conn::get_connection;
use model::{
    use_select::{use_select, CustomQueryParams, SelectParams},
    use_update::{use_update, UpdateParams},
};
use serde::{Deserialize, Serialize};
use tauri::command;
use utils::Tables;

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Sender {
    nit: String,
    name: String,
    city_id: usize,
    transporter_id: usize,
    phone_number: String,
    location_description: String,
    is_favorite: u8,
}

impl Sender {
    fn new() -> Self {
        Self {
            city_id: 0,
            is_favorite: 0,
            location_description: "".to_string(),
            name: "".to_string(),
            nit: "".to_string(),
            phone_number: "".to_string(),
            transporter_id: 0,
        }
    }

    pub fn obtain_sender_details(
        w: Option<HashMap<String, HashMap<String, String>>>,
    ) -> Result<Vec<HashMap<String, String>>, String> {
        let _conn = get_connection();

        let params = SelectParams {
            custom_query: Some(CustomQueryParams {
                values: String::from(
                    "n.*, c.id AS cityId, c.name AS city, 
                t.id AS transporterId, t.name AS transporter",
                ),
                join_into: String::from(
                    "INNER JOIN city c ON c.id = n.cityId 
              INNER JOIN transporter t on t.id = n.transporterId",
                ),
            }),
            table: Tables::Sender,
            w,
        };

        use_select(params)
    }

    pub fn set_favorite(w: HashMap<String, HashMap<String, String>>) -> bool {
        let mut values = HashMap::new();
        let mut w_for_params: HashMap<String, HashMap<String, String>> = HashMap::new();
        values.insert(String::from("isFavorite"), String::from("1"));

        let params_for_favorite = UpdateParams {
            table: Tables::Sender,
            values: values.clone(),
            w,
        };

        values.clear();
        let mut inner_map = HashMap::new();
        inner_map.insert(String::from("isFavorite"), String::from("1"));
        values.insert(String::from("isFavorite"), String::from("0"));
        w_for_params.insert(String::from("continue"), inner_map);

        let params = UpdateParams {
            table: Tables::Sender,
            values,
            w: w_for_params,
        };

        let update_favorite = use_update(params);
        let unset_favorite = use_update(params_for_favorite);

        unset_favorite && update_favorite
    }
}

#[command]
pub fn obtain_sender_details(
    w: Option<HashMap<String, HashMap<String, String>>>,
) -> Result<Vec<HashMap<String, String>>, String> {
    Sender::obtain_sender_details(w)
}

#[command]
pub fn set_favorite(w: HashMap<String, HashMap<String, String>>) -> bool {
    Sender::set_favorite(w)
}

/*
1032473956
Sebastian Benavides Fr */
