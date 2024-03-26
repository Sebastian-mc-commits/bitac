pub mod event_methods;
pub mod menu;
pub mod menu_event;
pub mod use_type;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};
use std::{collections::HashMap, hash::Hash, u16, usize};

pub fn remove_last_word(value: &str) -> String {
    let words: Vec<&str> = value.trim().split_whitespace().collect();
    let new_str = words[..words.len() - 1].join(" ");

    new_str.trim_end().to_string()
}
pub fn convert_to_where(w: &HashMap<String, HashMap<String, String>>) -> String {
    let mut w_string: String = "".to_string();
    let mut is_continue = false;

    for (keyword, nest_values) in w.iter() {
        for (key, value) in nest_values.iter() {
            if keyword == "continue" {
                is_continue = true;
                w_string.push_str(&format!("{} = '{}'", key, value));
            } else if keyword == "different" {
                is_continue = true;
                w_string.push_str(&format!("{} != '{}'", key, value));
            } else {
                w_string.push_str(&format!("{} = '{}' {} ", key, value, keyword));
            }
        }
    }

    if !is_continue {
        remove_last_word(&w_string)
    } else {
        w_string.to_string()
    }
}

#[derive(Debug, Clone, Deserialize)]
pub enum Tables {
    Sender,
    Destination,
    City,
    Transporter,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum StringOrUsize {
    Str(String),
    Usize(usize),
}

pub fn selected_table<'a>(table: Tables) -> &'a str {
    match table {
        Tables::Sender => "sender",
        Tables::Destination => "destination",
        Tables::City => "city",
        Tables::Transporter => "transporter",
    }
}

pub fn set_values_string(set_values: &HashMap<String, String>) -> String {
    let mut set_value = String::from("");

    for (key, value) in set_values.iter() {
        set_value.push_str(format!("{} = '{}', ", key, value).as_str());
    }

    set_value.trim()[..set_value.len() - 2].to_string()
}

pub struct ValuesAndTypes {
    pub values: String,
    pub types: String,
}
pub fn values_and_types(v: &HashMap<String, StringOrUsize>) -> ValuesAndTypes {
    let mut types = String::new();
    let mut values = String::new();

    for (typ, val) in v.iter() {
        types.push_str(&format!("{}, ", typ));
        match val {
            StringOrUsize::Str(new_value) => values.push_str(&format!("'{}', ", new_value)),
            StringOrUsize::Usize(new_usize) => values.push_str(&format!("{}, ", new_usize)),
        };
    }

    ValuesAndTypes {
        values: values[..values.len() - 2].to_string(),
        types: types[..types.len() - 2].to_string(),
    }
}

pub fn plain_values_and_types<T>(v: T) -> ValuesAndTypes
where
    T: Serialize,
{
    let mut types = String::new();
    let mut values = String::new();

    let obj = if let Value::Object(val) = serde_json::to_value(v).unwrap() {
        val
    } else {
        Map::new()
    };

    for (typ, val) in obj.iter() {
        types.push_str(&format!("{}, ", typ.to_string()));

        let value = if val.is_number() {
            format!("'{}', ", val)
        }
        else {
            format!("{}, ", val)
        };

        values.push_str(value.as_str());
    }

    ValuesAndTypes {
        values: values[..values.len() - 2].to_string(),
        types: types[..types.len() - 2].to_string(),
    }
}
