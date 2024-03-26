use crate::config::_conn::get_connection;
use crate::config::database::tables::get_tables;

pub fn insert_tables() {
    let conn = get_connection();
    for &table in get_tables().iter() {
        conn.execute(table).unwrap();
    }

    println!("Tables inserted successfully");
}
