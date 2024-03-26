use std::collections::HashMap;

use serde::Deserialize;
use tauri::command;

use crate::{
    config::_conn::get_connection,
    utils::{convert_to_where, selected_table, Tables},
};

#[derive(Clone, Deserialize)]
pub struct UseDeleteParams {
    pub w: HashMap<String, HashMap<String, String>>,
    pub table: Tables,
}

#[command]
pub fn use_delete(params: UseDeleteParams) -> bool {
    let UseDeleteParams { table, w } = params;
    let query = String::from(format!(
        "DELETE FROM {} WHERE {}",
        selected_table(table),
        convert_to_where(&w)
    ));

    let conn = get_connection();
    match conn.execute(query) {
        Ok(_) => true,
        Err(_) => false,
    }
}
