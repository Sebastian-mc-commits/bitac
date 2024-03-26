import { classSelector, types } from "../../types/DOM.types.js"
import { constants, useReducer } from "./index.js"

setTimeout(() => {
  window.scrollTo({
    top: 90,
    behavior: "smooth"
  })
}, types.bodyActiveTime)

useReducer.init({
  toggleButton: ({ target }) => {
    const { transporterForm, cityForm } = useReducer.getEntriesByDataType()
    target.classList.toggle(classSelector.CHANGE_BUTTON_STYLE)
    const { setScaleClass } = constants
    let isScaleSet = false
    Array.from([transporterForm, cityForm]).forEach(form => {
      if (!form.classList.contains(setScaleClass) && !isScaleSet) {
        form.classList.add(setScaleClass)
        isScaleSet = true
        return
      }
      else if (form.classList.contains(setScaleClass)) {
        form.classList.remove(setScaleClass)
      }
    })
  },
})
