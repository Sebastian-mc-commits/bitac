import { UseReducer, setLinkStyles } from "../../helpers/index.js"
import { useBreakDownIntoComponents } from "../componentUtilities.js"

export default class {

  #componentName = "component-right-bar"
  #element
  #id = "rightBarId"
  #rightBarInactiveClass = "hide-bar"
  #childIdentifier = "rightBarType"
  #parentIdentifier = "[data-right-bar-type]"
  #reducer = new UseReducer({})
  #reducerName = "rb"
  #bodyClassMover = "move-body-rb"
  #moveBodyWhenActive
  constructor({
    reducer = () => null,
    moveBodyWhenActive = true
  }) {
    this.#reducer = reducer
    this.#moveBodyWhenActive = moveBodyWhenActive
    customElements.define(this.#componentName, this.#component())
    customElements.whenDefined(this.#componentName)
      .then(() => {
        this.#element = document.querySelector("#" + this.#id)
        this.#init()
      })
  }

  #component = () => class extends HTMLElement {
    constructor() {
      super()

      this.innerHTML = `
      <div class="right-bar hide-bar" id='rightBarId'>
      <h2 class="right-bar-title" data-right-bar-type='title'></h2>
      <div class="right-bar-body" data-right-bar-type='body'>
      </div>
    </div>
      `
    }

    connectedCallback() {
      setLinkStyles(import.meta.url)
    }
  }

  #init = () => {
    const useReducer = new UseReducer({
      entries: this.#element,
      isArray: false,
      name: this.#reducerName
    })

    this.#reducer(useReducer)
  }

  isActive = () => !this.#element.classList.contains(this.#rightBarInactiveClass)

  active = (params = {}) => {
    useBreakDownIntoComponents({
      childIdentifier: this.#childIdentifier,
      parentIdentifier: this.#parentIdentifier,
      element: this.#element,
      params
    })

    if (this.isActive()) return

    this.#element.classList.remove(this.#rightBarInactiveClass)
    if (this.#moveBodyWhenActive) {
      document.body.classList.add(this.#bodyClassMover)
    }
  }

  hide = (cleanDataWhenHide = false) => {
    if (!this.isActive()) return

    this.#element.classList.add(this.#rightBarInactiveClass)
    if (cleanDataWhenHide) {
      useBreakDownIntoComponents({
        childIdentifier: this.#childIdentifier,
        parentIdentifier: this.#parentIdentifier,
        element: this.#element,
        params: {
          body: target => target.innerHTML = "",
          title: target => target.textContent = ""
        }
      })
    }
    if (this.#moveBodyWhenActive) {
      document.body.classList.remove(this.#bodyClassMover)
    }
  }
  setReducerType = (type) => `data-${this.#reducerName}-type='${type}'`
}