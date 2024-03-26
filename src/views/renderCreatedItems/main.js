import { cityAndTransporterHTML, cityModel, constants, destinationModel, iterateByElements, renderDataViewContext, rightBarComponent, senderAndDestinationHTML, senderModel, transporterModel, useReducer } from "./index.js";
import { useModel } from "./ops.js";

useReducer.init({
  senderAndDestination: async ({ dataset: { type } }) => {

    const isBySender = type === constants.SENDER_TYPE
    const newModel = isBySender ? senderModel : destinationModel
    const { renderElements } = useReducer.getEntriesByDataType()
    const data = await newModel?.[isBySender ? "obtainSenderDetails" : "obtainDestinationDetails"]({})

    renderElements.innerHTML = iterateByElements(data, senderAndDestinationHTML)

    renderDataViewContext.setObjectUnchangeable({
      currentSelectedData: type
    })
    rightBarComponent.hide(true)
  },

  cityAndTransporter: async ({ dataset: { type } }) => {

    const isByCity = type === constants.CITY_TYPE
    const newModel = isByCity ? cityModel : transporterModel
    const { renderElements } = useReducer.getEntriesByDataType()
    const data = await newModel.find({})
    renderElements.innerHTML = iterateByElements(data, cityAndTransporterHTML)
    renderDataViewContext.setObjectUnchangeable({
      currentSelectedData: type
    })
    rightBarComponent.hide(true)
  },

  showMenuOptions: async ({ target }) => {
    const id = target.closest("[data-id]")
    renderDataViewContext.setObjectUnchangeable({
      idContext: id?.dataset?.id
    })

    const { mainField, model } = useModel(renderDataViewContext.current.currentSelectedData)
    const [data] = await model.find({
      w: {
        continue: {
          [mainField]: id?.dataset?.id
        }
      }
    })

    const name = String(data?.name || "")[0].toUpperCase() + String(data?.name).slice(1)
    rightBarComponent.active({
      title: target => target.textContent = `Opciones para: ${name}`,
      body: target => target.innerHTML = `
        <h3>Nota: Si eliminas este dato, se eliminaran todos aquellos que hagan parte de el</h3>
        <div class='rightBarButtons renderDetailOptions'>
          <button class='deleteButton' ${rightBarComponent.setReducerType("onDelete")}>Eliminar: ${name}</button>
          </div>
          `
          // <button class='updateButton' ${rightBarComponent.setReducerType("onUpdate")}>Actualizar: ${name}</button>
    })
  }
})