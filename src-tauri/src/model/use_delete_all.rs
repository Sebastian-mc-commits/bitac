use crate::config::_conn;

pub fn use_delete_all(password: &str) -> Result<bool, String> {
    if password != String::from("bitac_klug") {
        return Ok(false);
    }
    let _conn = &_conn::get_connection();

    let tables: Vec<&str> = vec!["sender", "transporter", "city", "destination"];

    let triggers: Vec<&str> = vec!["delete_sender_destination"];

    for t in tables.iter() {
        _conn
            .execute(format!("DROP TABLE IF EXISTS {};", t))
            .expect("Error droping tables");
    }

    for t in triggers.iter() {
        _conn
            .execute(format!("DROP TRIGGER IF EXISTS {};", t))
            .expect("Error dropping triggers");
    }

    Ok(true)
}