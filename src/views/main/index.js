import { HalfPageModal, Input, ModalFooter } from "../../components/index.js"
import { UseReducer, useSignalJs } from "../../helpers/index.js"
import { CityModel, DestinationModel, SenderModel, TransporterModel } from "../../models/index.js"
import { destinationValues, senderInputValues } from "../../utils/const/commonInputFields.js"
import { printHeaderMessage } from "../../utils/functions/DOM/DOMutilities.js"
import { contextViewSubmitHandler, modalBodyClick, setPrintData } from "./ops.js"

export const viewContext = useSignalJs({
  isSenderForm: true,
  cityIdSelected: null,
  transporterIdSelected: null
})

export const constants = {
  formSelectSelector: "#formSelects",
  setScaleClass: "setScale",
  mainContainerSelector: "#mainContainer",
  DESTINATION_ID: "destinationId",
  SENDER_ID: "senderId"
}

export const useReducer = new UseReducer({
  entries: document.querySelectorAll(constants.mainContainerSelector),
  isArray: true
})

export const senderForm = new Input({
  buttonTitle: "Crear Remitente",
  id: constants.SENDER_ID,
  submitHandler: contextViewSubmitHandler,
  params: senderInputValues
})

export const destinationForm = new Input({
  buttonTitle: "Crear Destinatario",
  id: constants.DESTINATION_ID,
  submitHandler: contextViewSubmitHandler,
  params: destinationValues,
})

export const cityModel = new CityModel()
export const transporterModel = new TransporterModel()
export const senderModel = new SenderModel()
export const destinationModel = new DestinationModel()
export const modalFooter = new ModalFooter()
export const halfPageModal = new HalfPageModal({
  title: "Seleccionar",
  useDoneButton: false,
  onModalBodyClick: (params) => modalBodyClick(params)[params.dataset.type]()
})

export const headerModalMessage = printHeaderMessage(setPrintData, true)

Input.whenChangeFormState = (areFormsValid) => areFormsValid ?
  headerModalMessage.activeModalHeader({})
  :
  headerModalMessage.closeModalHeader()

export const renderOptions = ({ id, name }) => `
  <option value='${id}'>${name}</option>
`
export const iterateRenderOptions = (values = [{ id: "", name: "", nit }]) => {
  let HTML = ""
  for (const { id, name, nit } of values) {
    HTML += renderOptions({
      id: id || nit,
      name
    })
  }

  return `
    <option value='' selected>Vacio</option>
    ${HTML}
  `
}

export const renderContent = ({
  name,
  nit,
  phoneNumber,
  locationDescription = null
}) => `
  <div class='renderContent'>
  <h4>Datos</h4>
  <p><strong>Empresa: </strong>${name}</p>
  <p>Nit: ${nit}</p>
  <p>Telefono: ${phoneNumber}</p>
  ${locationDescription ? `<p>Direccion: ${locationDescription}</p>` : ""}

  <div class='renderDetailOptions'>
    <button data-type='selectValues' class='updateButton' data-id=${nit}>Seleccionar ${name}</button>
  </div>
  </div>
`

export const iterateRenderContent = (data) => {

  let HTML = ""

  for (const d of data) {
    HTML += renderContent(d)
  }

  return HTML
}