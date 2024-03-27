use serde::{Deserialize, Serialize};
use tauri::command;

use crate::services::key_value_service::KeyValueStore;

#[derive(Deserialize, Serialize, Debug)]
pub struct Code {
    pub code: String,
}

#[command]
pub fn key_value_code(code: String) -> KeyValueStore<Code> {
    KeyValueStore {
        filename: String::from("code.json"),
        dirname: String::from("key_values"),
        contents: Code { code },
    }
}
