import { UseReducer } from "../../helpers/index.js"
import Global from "../../models/Global.js"
import { cityModel, constants, destinationModel, modalFooter, renderDataViewContext, rightBarComponent, senderModel, transporterModel, useReducer } from "./index.js"

export const rightBarReducer = (R = new UseReducer({})) => {

  R.init({
    onDelete: async () => {
      const { idContext, currentSelectedData } = renderDataViewContext.current
      const { mainField, model } = useModel(currentSelectedData)
      const { renderElements } = useReducer.getEntriesByDataType()

      const isDeleted = await model.delete({
        continue: {
          [mainField]: idContext
        }
      })

      if (isDeleted) {
        renderElements?.querySelector(`[data-id='${idContext}']`)?.remove()
        rightBarComponent.hide(true)
      }
 
      modalFooter.active({
        isSuccess: isDeleted,
        message: isDeleted ? "Elemento eliminado satisfactoriamente" : "No se pudo eliminar el elemento :(",
        useErrorTitle: !isDeleted,
        useSuccessTitle: isDeleted,
        duration: 3000
      })
    },

    onUpdate: () => {

    }
  })
}

export const useModel = (type) => {

  let model = new Global()
  let mainField = ""
  const { CITY_TYPE, DESTINATION_TYPE, SENDER_TYPE, TRANSPORTER_TYPE } = constants
  switch (type) {
    case SENDER_TYPE: {
      model = senderModel
      mainField = "nit"
      break
    }

    case DESTINATION_TYPE: {
      model = destinationModel
      mainField = "nit"
      break
    }

    case CITY_TYPE: {
      model = cityModel
      mainField = "id"
      break
    }

    case TRANSPORTER_TYPE: {
      model = transporterModel
      mainField = "id"
      break
    }
  }

  return {
    model,
    mainField
  }
}