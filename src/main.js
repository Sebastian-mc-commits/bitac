import { classSelector, types } from "./types/DOM.types.js";
import { cityModel, constants, destinationForm, destinationModel, halfPageModal, iterateRenderContent, iterateRenderOptions, senderForm, senderModel, transporterModel, useReducer, viewContext } from "./views/main/index.js";
import { selectsData } from "./views/main/ops.js";

setTimeout(() => {
  window.scrollTo({
    top: 90,
    behavior: "smooth"
  })
}, types.bodyActiveTime)

useReducer.init({
  toggleButton: ({ target }) => {
    target.classList.toggle(classSelector.CHANGE_BUTTON_STYLE)
    const { forms } = selectsData()
    const { mainContainerSelector, setScaleClass } = constants
    let isScaleSet = false
    forms.forEach(form => {
      const newForm = form.closest(mainContainerSelector)
      if (!newForm.classList.contains(setScaleClass) && !isScaleSet) {
        newForm.classList.add(setScaleClass)
        isScaleSet = true
        return
      }
      else if (newForm.classList.contains(setScaleClass)) {
        newForm.classList.remove(setScaleClass)
      }
    })
  },

  selectDataForForm: async ({ dataset: { type } }) => {
    const validate = type === "sender"
    viewContext.setObjectUnchangeable({
      isSenderForm: validate
    })

    const newRender = validate ? senderModel : destinationModel

    const data = await newRender.find({})

    halfPageModal.activeModal({
      body: (target) => target.innerHTML = `
        <div class='renderContainer'>
          ${iterateRenderContent(data)}
        </div>
      `
    })
  }
})

useReducer.render({
  renderCities: async ({ element }) => {

    const cities = await cityModel.find({})
    element.innerHTML = iterateRenderOptions(cities)
  },

  renderTransporters: async ({ element }) => {

    const transporters = await transporterModel.find({})

    element.innerHTML = iterateRenderOptions(transporters)
  },

  renderSenders: async ({ element }) => {

    const senders = await senderModel.find({})

    element.innerHTML = iterateRenderOptions(senders)
  },

  renderDestinations: async ({ element }) => {

    const senders = await destinationModel.find({})

    element.innerHTML = iterateRenderOptions(senders)
  }
})

useReducer.ownListener("change")({
  selectChange: async ({ target, dataset: { type } }) => {
    const child = Array.from(target.children).find(el => el.selected)
    const validate = type === "sender"
    viewContext.setObjectUnchangeable({
      isSenderForm: validate,
    })

    const newRender = validate ? senderModel : destinationModel

    const [data] = await newRender.find({
      w: {
        continue: {
          nit: child.value
        }
      }
    })

    const newData = Object.keys(data).map(key => ({
      id: key,
      value: data[key]
    }))
    const form = validate ? senderForm : destinationForm
    form.setInputValues(newData)
    form.setFormValid()
  }
})

useReducer.doubleClick({
  toggleButton: () => {
    const { forms } = selectsData()
    const { mainContainerSelector, setScaleClass } = constants
    forms.forEach(form => {
      const newForm = form.closest(mainContainerSelector)
      if (!newForm.classList.contains(setScaleClass)) return
      newForm.classList.remove(setScaleClass)
    })
  },
  clickTime: 250
})