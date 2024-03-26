use sqlite::Connection;

pub fn get_connection() -> Connection {
    let _conn = Connection::open("bitac_db.sqlite").unwrap();

    _conn
}
