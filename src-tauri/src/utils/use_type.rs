use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum EventTypes<'a> {
    Str(&'a str),
    Bool(bool),
}
