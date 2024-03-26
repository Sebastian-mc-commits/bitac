use crate::{config, utils};
use config::_conn;
use serde::Deserialize;
use std::collections::HashMap;
use tauri::command;
use utils::{convert_to_where, selected_table, set_values_string, Tables};

#[derive(Clone, Debug, Deserialize)]
pub struct UpdateParams {
    pub w: HashMap<String, HashMap<String, String>>,
    pub values: HashMap<String, String>,
    pub table: Tables,
}

#[command]
pub fn use_update(params: UpdateParams) -> bool {
    let UpdateParams { values, w, table } = params;

    let conn = _conn::get_connection();
    let query = format!(
        "UPDATE {} SET {} WHERE {}",
        selected_table(table),
        set_values_string(&values),
        convert_to_where(&w)
    );

    conn.execute(query).is_ok()
}
