use tauri::{CustomMenuItem, Menu, Submenu};

pub fn render_menu() -> Menu {
    let auth = CustomMenuItem::new("auth".to_string(), "autenticacion");

    let cities_transports = CustomMenuItem::new(
        "cities_transports".to_string(),
        "Crear Ciudades y transportes",
    );
    let senders_destinations = CustomMenuItem::new(
        "senders_destinations".to_string(),
        "Crear Remitentes y destinatarios",
    );
    let searcher = CustomMenuItem::new("searcher".to_string(), "Buscador");

    let delete_all = CustomMenuItem::new("delete_all".to_string(), "Eliminar Todo");
    let close = CustomMenuItem::new("close".to_string(), "Cerrar");

    let render_data = CustomMenuItem::new("render_data".to_string(), "Datos creados");

    let more_submenu = Submenu::new("Mas...", Menu::new().add_item(delete_all).add_item(close));

    let submenu = Submenu::new(
        "Opciones",
        Menu::new()
            .add_item(auth)
            .add_item(searcher)
            .add_item(cities_transports)
            .add_item(senders_destinations)
            .add_item(render_data),
    );

    Menu::new().add_submenu(submenu).add_submenu(more_submenu)
}
