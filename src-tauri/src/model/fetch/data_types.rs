use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct City {
    pub name: String,
    pub id: usize,
    // pub _id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Transporter {
    pub name: String,
    pub id: usize,
    // pub _id: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Sender {
    pub nit: String,
    pub name: String,
    #[serde(rename = "cityId")]
    pub city_id: usize,
    #[serde(rename = "transporterId")]
    pub transporter_id: usize,
    #[serde(rename = "phoneNumber")]
    pub phone_number: String,
    #[serde(rename = "locationDescription")]
    pub location_description: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Destination {
    pub nit: String,
    pub name: String,
    #[serde(rename = "cityId")]
    pub city_id: usize,
    #[serde(rename = "senderId")]
    pub sender_id: String,
    #[serde(rename = "phoneNumber")]
    pub phone_number: String,
    #[serde(rename = "locationDescription")]
    pub location_description: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DBTypes {
    pub cities: Vec<City>,
    pub transporters: Vec<Transporter>,
    pub senders: Vec<Sender>,
    pub destinations: Vec<Destination>,
}
