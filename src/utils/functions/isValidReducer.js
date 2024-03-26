import reducerTypes from "../../types/reducerTypes.js";
import { emailRegex, passwordRegex } from "../const/regex.js";

const validate = (customHandleError, value, condition) => {
  if (typeof customHandleError === "function") {
    return !(value.length > 0 && customHandleError(value));
  }
  return !condition;
};

const isValidReducer = (value, type, customHandleError) => {

  value = value.toString();
  let hasError = false;
  let error = "";
  const { CITY, NIT, PHONE_NUMBER, NAME, EMAIL, PASSWORD, TRANSPORTER, LOCATION_DESCRIPTION } = reducerTypes;

  switch (type) {
    case CITY: {
      if (validate(customHandleError, value, value && value.length > 3)) {
        hasError = true;
        error = "Ingresa un ciudad correcta y no creada";
      }
      break;
    }

    case NIT: {
      if (validate(customHandleError, value, value && value.length > 5)) {
        hasError = true;
        error = "NIT incorrecto";
      }
      break;
    }

    case PHONE_NUMBER: {
      if (validate(customHandleError, value, value && value.length > 6)) {
        hasError = true;
        error = "Numero Incorrecto";
      }
      break;
    }

    case NAME: {
      if (validate(customHandleError, value, value && value.length > 2)) {
        hasError = true;
        error = "El nombre debe tener al menos 3 caracteres";
      }
      break;
    }

    case EMAIL: {
      if (validate(customHandleError, value, value && emailRegex.test(value))) {
        hasError = true;
        error = "Correo incorrecto";
      }
      break;
    }

    case PASSWORD: {
      if (
        validate(customHandleError, value, value && passwordRegex.test(value))
      ) {
        hasError = true;
        error = "Contraseña insegura";
      }
      break;
    }

    case TRANSPORTER: {
      if (validate(customHandleError, value, value && value.length > 4)) {
        hasError = true;
        error = "Ingresa una transportadora correcta";
      }
      break;
    }

    case LOCATION_DESCRIPTION: {
      if (validate(customHandleError, value, value && value.length > 3 && !parseInt(value))) {
        hasError = true;
        error = "incluye mas que numeros en la direccion";
      }
      break;
    }
  }

  return {
    hasError,
    error
  };
};

export default isValidReducer;
