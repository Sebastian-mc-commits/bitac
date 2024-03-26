use serde::{Deserialize, Serialize};

use crate::model::use_delete_all::use_delete_all;
use crate::EventParams;

use super::use_type::EventTypes;

#[derive(Clone, Serialize, Deserialize)]
pub struct EventMethodsReturnType<'a> {
    pub event_method_value: EventTypes<'a>,
    pub event_method_type: &'a str,
}

pub fn event_methods(
    EventParams {
        event_data,
        event_type,
    }: EventParams,
) -> Option<EventMethodsReturnType> {
    let mut return_type: Option<EventMethodsReturnType> = None;
    match event_type {
        "delete_all" => match event_data {
            EventTypes::Str(s) => {
                return_type = Some(EventMethodsReturnType {
                    event_method_value: EventTypes::Bool(use_delete_all(s).unwrap_or(false)),
                    event_method_type: "delete_all",
                });
            }
            _ => (),
        },

        _ => (),
    };

    return_type
}
