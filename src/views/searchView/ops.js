import { printWindow } from "../../helpers/index.js"
import createPrintView from "../../utils/functions/DOM/createPrintView.js"
import { appContext, data, renderSenderValuesHTML, senderModel, useReducer } from "./index.js"

export const modalClickReducer = {
  selectFavorite: async ({ target }, halfPageModal) => {
    const { id = "" } = target?.closest("[data-id]")?.dataset || {}
    if (!id) return

    const { renderSenderValues: { element } } = useReducer.getRenderContextFunctions()

    const { data, isUpdated } = await senderModel.updateFavorite(id)

    if (!isUpdated) return

    element.innerHTML = renderSenderValuesHTML(data)
    halfPageModal.closeModal()
  }
}

export const usePrint = async ({ currentData = [] }) => {

  const [sender] = await senderModel.obtainSenderDetails({
    w: {
      continue: {
        isFavorite: "1"
      }
    }
  })

  const elements = []

  currentData.forEach(destinationV => {

    const includes = appContext.current.idsKeeper.find(d => d.id === destinationV?.nit)
    if (includes) {
      for (let it = 0; it < includes.value; it++) {
        elements.push({
          destination: destinationV,
          sender
        })
      }
      return
    }

    elements.push({
      destination: destinationV,
      sender
    })
  })

  printWindow(
    createPrintView(elements)
  )
}

export const printByCheck = ({ dataset: { type } }) => {
  if (type !== "printByChecked") return
  const newData = data.filter(d => appContext.current.idsKeeper.some(ids => ids.id === d.nit))
  usePrint({
    currentData: newData
  })
}