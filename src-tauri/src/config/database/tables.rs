pub fn get_tables<'a>() -> Vec<&'a str> {
    vec![
        r#"CREATE TABLE IF NOT EXISTS city (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );"#,
        r#"CREATE TABLE IF NOT EXISTS transporter (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );"#,
        r#"CREATE TABLE IF NOT EXISTS sender (
      nit TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      cityId INTEGER,
      transporterId INTEGER,
      phoneNumber TEXT NOT NULL,
      locationDescription TEXT,
      isFavorite INTEGER CHECK (isFavorite IN (0, 1)) DEFAULT 0 NOT NULL,
      FOREIGN KEY (cityId) REFERENCES city (id) ON DELETE CASCADE,
      FOREIGN KEY (transporterId) REFERENCES transporter (id) ON DELETE CASCADE
    );"#,
        r#"CREATE TABLE IF NOT EXISTS destination (
          nit TEXT PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          cityId INTEGER,
          locationDescription TEXT,
          phoneNumber TEXT NOT NULL,
          senderId TEXT,
          FOREIGN KEY (senderId) REFERENCES sender (nit) ON DELETE SET NULL
          FOREIGN KEY (cityId) REFERENCES city (id) ON DELETE CASCADE
        );"#,
        r#"CREATE TRIGGER IF NOT EXISTS delete_sender_trigger
        AFTER DELETE ON sender
        BEGIN
            UPDATE destination
            SET senderId = NULL
            WHERE senderId = OLD.nit;
        END;"#,
    ]

    // vec![
    //     r#"CREATE TABLE IF NOT EXISTS users (
    //       nit TEXT PRIMARY KEY,
    //       name TEXT,
    //       age INTEGER
    //     );"#
    // ]
}
