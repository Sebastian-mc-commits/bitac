CREATE TABLE IF NOT EXISTS city (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  locationDescription TEXT,
);

CREATE TABLE IF NOT EXISTS transporter (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sender (
  nit TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  cityId INTEGER NOT NULL, 
  transporterId INTEGER NOT NULL,
  phoneNumber TEXT NOT NULL,
  locationDescription TEXT,
  FOREIGN KEY (cityId) REFERENCES city (id) ON DELETE SET NULL,
  FOREIGN KEY (transporterId) REFERENCES transporter (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS destination (
  nit TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  cityId INTEGER NOT NULL,
  locationDescription TEXT,
  phoneNumber TEXT NOT NULL,
  senderId TEXT,
  FOREIGN KEY (senderId) REFERENCES sender (nit) ON DELETE SET NULL
  FOREIGN KEY (cityId) REFERENCES city (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sender_destination (
  destinationId TEXT NOT NULL,
  senderId TEXT NOT NULL,
  dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (destinationId) REFERENCES destination (nit) ON DELETE SET NULL,
  FOREIGN KEY (senderId) REFERENCES sender (nit) ON DELETE SET NULL
);

CREATE TRIGGER IF NOT EXISTS delete_sender_trigger
AFTER DELETE ON sender
BEGIN
    UPDATE destination
    SET senderId = NULL
    WHERE senderId = OLD.nit;
END;