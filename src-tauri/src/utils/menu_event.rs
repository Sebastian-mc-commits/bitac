use tauri::{Manager, WindowBuilder, WindowMenuEvent, WindowUrl};

use crate::services::{key_value_service::KeyValueStoreMethods, key_values::key_value_code};
#[derive(Clone, serde::Serialize)]
struct Payload {
    go: String,
}

#[derive(Clone, serde::Serialize)]
struct MethodsPayload<'a> {
    method: &'a str,
}

// struct RedirectParams {
//     event: WindowMenuEvent,
//     view: &str
// }

pub fn menu_event_window(event: WindowMenuEvent) {
    let view_event = "view";
    let selected_view = |view: String| format!("views/{}/index.html", view);
    let window = event.window();

    match event.menu_item_id() {
        "auth" => {
            let exist_code = key_value_code("_".to_string()).full_path().exists();

            let view = if exist_code { "code-created" } else { "auth" }.to_string();

            window
                .emit(
                    &view_event,
                    Payload {
                        go: selected_view(view).into(),
                    },
                )
                .unwrap();
        }

        "cities_transports" => {
            window
                .emit(
                    &view_event,
                    Payload {
                        go: selected_view(String::from("cities_transports")).into(),
                    },
                )
                .unwrap();
        }

        "senders_destinations" => {
            window.emit("view", Payload { go: "".into() }).unwrap();
        }

        "render_data" => {
            window
                .emit(
                    &view_event,
                    Payload {
                        go: selected_view(String::from("renderCreatedItems")).into(),
                    },
                )
                .unwrap();
        }

        "searcher" => window
            .emit(
                "view",
                Payload {
                    go: selected_view(String::from("searchView")).into(),
                },
            )
            .unwrap(),

        "delete_all" => {
            window
                .emit(
                    "methods",
                    MethodsPayload {
                        method: "delete_all",
                    },
                )
                .unwrap();
        }

        "close" => {
            window.close().unwrap();
        }

        _ => {
            println!("Does not appear to be right");
        }
    };
}
