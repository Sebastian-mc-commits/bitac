use tauri::WindowMenuEvent;
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
            window
                .emit(
                    &view_event,
                    Payload {
                        go: selected_view(String::from("auth")).into(),
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
                .emit("methods", MethodsPayload { method: "delete_all" })
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
