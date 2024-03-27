use std::collections::HashMap;

use crate::config::_conn::get_connection;
use crate::utils::{
    plain_values_and_types, selected_table, values_and_types, StringOrUsize, Tables, ValuesAndTypes,
};
use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Clone, Deserialize)]
pub struct InsertParams {
    pub table: Tables,
    pub values: HashMap<String, StringOrUsize>,
}

#[command]
pub fn use_insert(params: InsertParams) -> bool {
    let _conn = get_connection();

    let InsertParams { table, values } = params;

    let ValuesAndTypes { types, values } = values_and_types(&values);

    let query = String::from(format!(
        "INSERT INTO {}({}) VALUES ({})",
        selected_table(table),
        types,
        values
    ));

    match _conn.execute(query) {
        Ok(_) => true,
        Err(_) => false,
    }
}

pub fn multiple_plain_insert<T>(table: Tables, data: Vec<T>) -> Result<(), sqlite::Error>
where
    T: Serialize,
{
    let _conn = get_connection();

    for d in data.iter() {
        let ValuesAndTypes { types, values } = plain_values_and_types(d);

        let query = String::from(format!(
            "INSERT INTO {}({}) VALUES ({})",
            selected_table(table.clone()),
            types,
            values
        ));

        _conn.execute(query)?;
    }

    Ok(())
}
