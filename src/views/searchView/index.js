import { HeaderModalMessage, HalfPageModal, ModalFooter } from "../../components/index.js"
import { UseReducer, useSignalJs } from "../../helpers/index.js"
import { DestinationModel, SenderModel } from "../../models/index.js"
import { modalClickReducer, printByCheck } from "./ops.js"

export const destinationModel = new DestinationModel()
export const data = await destinationModel.obtainDestinationDetails({})

export const destinationChildId = "destinationChild"
export const renderSenderValuesHTML = ({
  name,
  nit,
  phoneNumber,
  locationDescription
}) => `
  <div>
    <h4>Empresa</h4>
    <p>${name}</p>
  </div>
  <div>
    <span>Nit</span>
    <p>${nit}</p>
  </div>
  <div>
    <span>Numero</span>
    <p>${phoneNumber}</p>
  </div>
  <div>
    <span>Direccion</span>
    <p>${locationDescription}</p>
  </div>
`

export const senderModel = new SenderModel()

export const appContext = useSignalJs({
  hoverElementId: "",
  idsKeeper: []
})

export const useReducer = new UseReducer({
  entries: document.querySelectorAll("#mainContainer")
})

export const headerModalMessage = new HeaderModalMessage({
  header: "",
  body: ""
})

export const headerPrintMessage = new HeaderModalMessage({
  id: "headerPrintMessage",
  header: "<h3>Imprimir Seleccionados</h3>",
  body: "<button class='radiusButton' data-type='printByChecked'></button>",
  clickBodyHandler: printByCheck
})

export const halfPageModal = new HalfPageModal({
  title: "Remitentes",
  useDoneButton: false,
  onModalBodyClick: async ({ dataset: { type }, ...params }) => {
    const getCallback = modalClickReducer?.[type]

    if (typeof getCallback !== 'function') return

    getCallback(params, halfPageModal)
  }
})

export const modalFooter = new ModalFooter()
export const renderElementHTML = ({
  name = "",
  nit,
  phoneNumber,
}, useCheckboxContainer = true) => {

  const includesId = appContext.current.idsKeeper.some(d => d.id === nit)
  return `
  <div class='renderDataChild' data-id='${nit}' data-mousemove-type-child='renderChild' data-reduce-type='onSelectData' id='${destinationChildId}'>
      ${useCheckboxContainer ?
      `<div class='renderInputsContainer'>
        <input type='checkbox' ${includesId
        ?
        "checked"
        :
        ""
      }/>
        <input placeholder='Cantidad de rotulos "${name}"' type='number' value='1' ${includesId ?
        ""
        :
        "hidden"
      }/>
      </div>`
      :
      ""
    }
      <h2>${name}</h2>
      <p>NIT: <strong>${nit}</strong></p>
      <p>Telefono: ${phoneNumber}</p>
  </div>
`
}

export const renderHTMLValues = ({
  name = "",
  nit,
  phoneNumber,
  city,
  locationDescription
}) => `
  <div>
    <h2>${name}</h2>
    <p>NIT: <strong>${nit}</strong></p>
    <p>Telefono: ${phoneNumber}</p>
    <p>Ciudad: ${city}</p>
    <p>Direccion: ${locationDescription}</p>
  </div>
`
export const iterateForRenderElementHTML = (values = [{
  name: "",
  nit: "",
  phoneNumber: 0,
}]) => {
  let HTML = ""
  for (const { name, nit, phoneNumber } of values) {
    HTML += `
      <div class="renderContent" data-id='${nit}'>
        <h2>${name}</h2>
        <p>NIT: <strong>${nit}</strong></p>
        <p>Telefono: ${phoneNumber}</p>
        <button data-type='selectFavorite'>Seleccionar ${name} como favorito</button>
      </div>
    `
  }

  return HTML
}
