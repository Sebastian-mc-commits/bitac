import { Input, ModalFooter } from "../../components/index.js";
import { UseReducer } from "../../helpers/index.js";
import CityModel from "../../models/City.model.js";
import TransporterModel from "../../models/Transporter.model.js";
import { submitHandler } from "./ops.js";

export const constants = {
  setScaleClass: "setScale",
  CITY_FORM: "cityForm",
  TRANSPORTER_FORM: "transporterForm",
  CITY_ID: "cityId",
  TRANSPORTER_ID: "transporterId"
}

export const cityForm = new Input({
  buttonTitle: "Crear ciudad",
  id: constants.CITY_ID,
  submitHandler,
  params: [{
    input: {
      defaultValue: "",
      placeholder: "Medellin",
      type: "text"
    },
    inputName: "name",
    labelFor: "name",
    spanTitle: "Nombre de ciudad"
  }]
})

export const transporterForm = new Input({
  buttonTitle: "Crear Transportador",
  id: constants.TRANSPORTER_ID,
  submitHandler,
  params: [{
    input: {
      defaultValue: "",
      placeholder: "Servientrega",
      type: "text"
    },
    inputName: "name",
    labelFor: "name",
    spanTitle: "Nombre del tranportador"
  }]
})

export const useReducer = new UseReducer({
  entries: document.querySelectorAll("#mainContainer"),
  isArray: true
})

export const cityModel = new CityModel()
export const transporterModel = new TransporterModel()
export const modalFooter = new ModalFooter()