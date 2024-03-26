use crate::config::_conn::get_connection;
use crate::utils::{convert_to_where, selected_table, Tables};
use serde::Deserialize;
use std::collections::HashMap;
use tauri::command;

#[derive(Clone, Debug, Deserialize)]
pub struct SelectParams {
    pub table: Tables,
    pub w: Option<HashMap<String, HashMap<String, String>>>,
    pub custom_query: Option<CustomQueryParams>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct CustomQueryParams {
    pub values: String,
    pub join_into: String,
}

#[command]
pub fn use_select(params: SelectParams) -> Result<Vec<HashMap<String, String>>, String> {
    let SelectParams {
        custom_query,
        table,
        w,
    } = params;

    let mut senders_values = HashMap::new();
    let mut senders: Vec<HashMap<String, String>> = Vec::new();
    let where_str = if let Some(v) = w {
        format!(" WHERE {}", convert_to_where(&v))
    } else {
        String::new()
    };

    let _conn = get_connection();

    let query = match custom_query {
        Some(CustomQueryParams { values, join_into }) => format!(
            "SELECT {} FROM {} n {} {}",
            values,
            &selected_table(table),
            join_into,
            where_str
        ),
        _ => format!("SELECT * FROM {} {}", &selected_table(table), where_str),
    };

    _conn.iterate(&query, |row| {
        for &(key, value) in row.iter() {
            senders_values.insert(key.to_string(), value.unwrap_or("UNKNOWN").to_string());
        }

        senders.push(senders_values.clone());
        senders_values.clear();
        true
    });

    Ok(senders)
}

#[command]
pub fn exists(table: Tables, w: HashMap<String, HashMap<String, String>>) -> bool {
    let _conn = get_connection();
    let mut val: usize = 0;
    let query = format!(
        "SELECT * FROM {} WHERE {}",
        selected_table(table),
        convert_to_where(&w)
    );

    _conn
        .iterate(query, |_| {
            val += 1;
            true
        })
        .unwrap();

    val >= 1
}

pub fn plain_select(query: &str) -> Vec<HashMap<String, String>> {
    let _conn = get_connection();
    let mut values = HashMap::new();
    let mut data: Vec<HashMap<String, String>> = Vec::new();

    _conn.iterate(&query, |row| {
        for &(key, value) in row.iter() {
            values.insert(key.to_string(), value.unwrap_or("UNKNOWN").to_string());
        }

        data.push(values.clone());
        values.clear();
        true
    });

    data
}
