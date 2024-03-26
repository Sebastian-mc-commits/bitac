import { ModalFooter, RightBar } from "../../components/index.js";
import { UseReducer, useSignalJs } from "../../helpers/index.js";
import { CityModel, DestinationModel, SenderModel, TransporterModel } from "../../models/index.js";
import { validateElement } from "../../utils/functions/DOM/createPrintView.js";
import { rightBarReducer } from "./ops.js";

export const constants = {
  MAIN_CONTAINER_SELECTOR: "#mainContainer",
  SENDER_TYPE: "sender",
  DESTINATION_TYPE: "destination",
  CITY_TYPE: "city",
  TRANSPORTER_TYPE: "transporter"
}

export const renderDataViewContext = useSignalJs({
  currentSelectedData: "",
  idContext: null
})

export const useReducer = new UseReducer({
  entries: document.querySelectorAll(constants.MAIN_CONTAINER_SELECTOR),
  isArray: true
})

export const senderModel = new SenderModel()
export const destinationModel = new DestinationModel()
export const cityModel = new CityModel()
export const transporterModel = new TransporterModel()

export const rightBarComponent = new RightBar({
  reducer: rightBarReducer
})
export const modalFooter = new ModalFooter()
export const senderAndDestinationHTML = ({
  nit,
  name,
  phoneNumber,
  city,
  locationDescription,
  transporter = null
}) => `
  <div class="shadow renderContent" data-id=${nit}>
  <input type='checkbox' data-reduce-type='checkElement'/>
  <h4>${name}</h4>
  <p><strong>Telefono:</strong> ${phoneNumber}</p>
  <p><strong>Nit:</strong> ${nit}</p>
  <p><strong>Ciudad:</strong> ${city}</p>
  ${validateElement(
  `<p><strong>Transportador asociado:</strong> ${transporter}</p>`,
  transporter !== null
)}
    <p><strong>Direccion:</strong> ${locationDescription}</p>
    <button class="custom-button-2" role="button" data-reduce-type='showMenuOptions'>Opciones</button>
  </div>
`

export const cityAndTransporterHTML = ({
  id,
  name
}) => `
  <div class="shadow renderContent" data-id=${id}>
    <h4>${name}</h4>
    <p>Id: ${id}</p>
    <button class="custom-button-2" role="button" data-reduce-type='showMenuOptions'>Opciones</button>
  </div>
`

export const iterateByElements = (data, handler) => {
  let HTML = ""

  for (const d of data) {
    HTML += handler(d)
  }

  return HTML
}