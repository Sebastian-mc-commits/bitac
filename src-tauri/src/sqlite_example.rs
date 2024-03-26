use crate::config::connection;
use crate::database::{create_tables, queries};
use queries::*;

use sqlite::Connection;

pub fn example() {
    connection();
    create_tables();
    destination::create_destination();
    let pool = Connection::open(":memory:").unwrap();

    let query = "
    CREATE TABLE users (name TEXT, age INTEGER);
    INSERT INTO users VALUES ('Alice', 42);
    INSERT INTO users VALUES ('Bob', 69);
";

    pool.execute(query).unwrap();
    let new_query = "SELECT * FROM users;";

    pool.iterate(new_query, |pairs| {
        for &(name, value) in pairs.iter() {
            println!("{} = {}", name, value.unwrap());
        }
        true
    })
    .unwrap();
    // if let Some(_row) = stmt.next().unwrap() {
    //     println!("Table created successfully");
    // } else {
    //     println!("Error: Table not created");
    // }
}
