import { UseReducer } from "../../../helpers/index.js";
import { setLinkStyles } from "../../../helpers/navigation.js";
import { breakDownIntoComponents } from "../../componentUtilities.js";

export default class {

  #id
  #idSelector
  #element
  #componentTag = "component-header-message-initializer"
  #useReducer
  #clickBodyHandler = () => null
  #componentHTML = ({
    header,
    body
  }) => {

    const element = document.createElement("div")
    element.className = "headerMessage"
    element.innerHTML = `
    <button class='onCloseButton' data-md-type='onCloseModalHeader'>X</button>
      <div data-header-modal-type='header'>${header}</div>
      <div class='headerMessageChild' data-header-modal-type='body' data-md-type='clickBody'>
        ${body}
      
      </div>
    `

    return element
  }

  constructor({
    header,
    body,
    id = "headerMessage",
    clickBodyHandler,
    useReducer = () => null
  }) {

    this.#useReducer = useReducer
    this.#id = id
    this.#clickBodyHandler = clickBodyHandler
    this.#idSelector = `[data-modal-header-id="${this.#id}"]`
    const isModalCreated = customElements.get(this.#componentTag)

    if (!isModalCreated) {
      customElements.define(this.#componentTag, this.#component(header, body, this.#componentHTML))
      customElements.whenDefined(this.#componentTag)
        .then(() => {
          this.#element = document.querySelector(this.#idSelector).firstElementChild
          this.#init()
        })
      return
    }

    const component = document?.querySelector(this.#idSelector)
    component.innerHTML = ""
    component.appendChild(this.#componentHTML({
      body,
      header
    }))

    this.#element = component.firstElementChild
    this.#init()
  }

  #component = (header, body, callbackHTML) => class extends HTMLElement {
    constructor() {
      super()

      this.appendChild(callbackHTML({
        header,
        body
      }))
    }

    connectedCallback() {
      setLinkStyles(import.meta.url)
    }
  }

  #init = () => {
    const useReducer = new UseReducer({
      entries: this.#element,
      name: "md",
      isArray: false
    })

    useReducer.init({
      onCloseModalHeader: this.closeModalHeader
    })

    useReducer.ownListener("click")({
      clickBody: (params) => {
        const { dataset: { type = "" } = {} } = params
        if (!type) return

        this.#clickBodyHandler(params)
      }
    })

    this.#useReducer(useReducer)
  }

  closeModalHeader = () => {
    const isActive = this.#element.classList.contains("showHeaderMessage");

    if (!isActive) return
    this.#element.classList.remove("showHeaderMessage")
  }

  activeModalHeader = (params = {}) => {

    if (Object.keys(params).length > 0) {
      const components = breakDownIntoComponents(this.#element, {
        childIdentifier: "headerModalType",
        parentIdentifier: "[data-header-modal-type]"
      })

      for (const key in params) {
        const element = components[key]
        const callback = params[key]

        if (!element || typeof callback !== "function") continue

        callback(element)
      }
    }

    const isActive = this.#element.classList.contains("showHeaderMessage");

    if (isActive) return
    this.#element.classList.add("showHeaderMessage")
  }
}