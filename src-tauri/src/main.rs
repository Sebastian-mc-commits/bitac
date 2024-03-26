#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod config;
mod model;
mod utils;

extern crate dotenv;
use std::sync::Mutex;

use config::database::create_tables;
use model::{
    destination::obtain_destination_details,
    fetch::{
        self,
        data_transfer::{
            generate_code, obtain_transferred_data_by_code, obtain_transferred_data_by_code_and_set,
        },
    },
    sender::{obtain_sender_details, set_favorite},
    use_delete,
    use_delete_all::use_delete_all,
    use_insert, use_select, use_update,
};
use serde::Deserialize;
use tauri::{command, Manager};
use utils::{menu::render_menu, menu_event::menu_event_window, use_type::EventTypes};
use uuid::Uuid;

use crate::utils::event_methods::{self};

#[command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
//
#[command]
fn get_uuid() -> String {
    let uuid = Uuid::new_v4().to_string();

    uuid
}

#[derive(Deserialize)]
pub struct EventParams<'a> {
    pub event_type: &'a str,
    pub event_data: EventTypes<'a>,
}

#[tokio::main]
async fn main() {
    create_tables::insert_tables();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_uuid,
            obtain_destination_details,
            obtain_sender_details,
            use_select::use_select,
            use_select::exists,
            use_update::use_update,
            use_delete::use_delete,
            set_favorite,
            use_insert::use_insert,
            generate_code,
            obtain_transferred_data_by_code,
            obtain_transferred_data_by_code_and_set,
        ])
        .setup(|app| {
            let event_id = app.listen_global("methods", |handler| {
                let mut return_type = Mutex::new(None);
                let mut return_type_guard = return_type.lock().unwrap();
                match handler.payload() {
                    Some(param) => {
                        let new_data: Result<EventParams, _> = serde_json::from_str(param);

                        match new_data {
                            Ok(data) => {
                                let mut r = return_type_guard;
                                *r = Some(event_methods::event_methods(data));
                            }
                            Err(_) => (),
                        };
                    }
                    None => (),
                };
            });
            Ok(())
        })
        .menu(render_menu())
        .on_menu_event(menu_event_window)
        .run(tauri::generate_context!())
        .unwrap_or(());
}

// let mut vv = HashMap::new();
//     vv.insert(String::from("nit"), String::from("111111"));
//     let mut w = HashMap::new();
//
//     w.insert(String::from("different"), vv);
//     let params = use_select::SelectParams {
//         custom_query: None,
//         table: Tables::Sender,
//         w: Some(w),
//     };
//
//     print!("{:?}", use_select::use_select(params));
// let mut v: HashMap<String, HashMap<String, String>> = HashMap::new();
// let mut and = HashMap::new();
// and.insert("nit".to_string(), "111111".to_string());
// and.insert("Hello2".to_string(), "MEme2".to_string());
// v.insert("continue".to_string(), and);
// let pt = Select_params {
//     table: Tables::Sender,
//     w: Some(v),
//     custom_query: None,
// };

// println!("{:?}", set_values_string(&and));
//
//     print!("{:?}", use_select(pt));
// drop_tables("bitac_klug");
// on_database_change(|event| {
//     println!("Data changed");
// });
