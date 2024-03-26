import { UseReducer, setLinkStyles } from "../../../helpers/index.js";
import { breakDownIntoComponents, useBreakDownIntoComponents } from "../../componentUtilities.js";
import { setOverlay, unsetOverlay } from "../../overlay/index.js";

export default class {

  #componentName = "component-half-page-modal"
  #element
  #id = "halfPageModal"
  #modalActiveClass = "enableHalfPageModal"
  #overlayId = "half-page-modal"
  #childIdentifier = "modalHalfType"
  #parentIdentifier = "[data-modal-half-type]"
  #handleDonePress
  #onModalBodyClick
  #closeModal = true
  #whenCloseModalIfDisabled = () => null
  constructor({
    defaultContent = "<div id='mainContent'></div>",
    title,
    useDoneButton = true,
    handleDonePress = () => null,
    onModalBodyClick = () => null
  }) {

    this.#handleDonePress = handleDonePress
    this.#onModalBodyClick = onModalBodyClick
    customElements.define(this.#componentName, this.#component(
      {
        defaultContent,
        title,
        id: this.#id,
        useDoneButton
      }
    ))
    customElements.whenDefined(this.#componentName).then(() => {
      this.#element = document.querySelector("#" + this.#id)
      this.#init()
    })
  }

  #component = ({ defaultContent, title, id, useDoneButton }) => class extends HTMLElement {
    constructor() {
      super()

      this.elementHTML = `
        <section class='modal' id='${id}'>
          <div class='modalHeader'>
            <h3 data-modal-half-type='title'>${title}</h3>
            <button data-hm-type='handleCloseModal'>X</button>
          </div>
          <div class='modalBody' data-hm-type='onModalBodyClick' data-modal-half-type='body'>
            ${defaultContent}
          </div>
          <div class='modalFooter' data-modal-half-type='footer'>
            <button class='doneElement' data-hm-type='doneButtonPressed' ${useDoneButton ? "" : "hidden"}>Todo listo</button>
          </div>
        </section>
      `

      this.hidden = true
      this.innerHTML = this.elementHTML
    }

    connectedCallback() {
      setLinkStyles(import.meta.url)
      this.hidden = false
    }
  }

  #init = () => {
    const useReducer = new UseReducer({
      entries: this.#element,
      isArray: false,
      name: "hm"
    })

    useReducer.init({
      handleCloseModal: () => this.closeModal(false),
      doneButtonPressed: () => this.#handleDonePress(this.closeModal),
    })

    useReducer.ownListener("click")({
      onModalBodyClick: (params) => {
        const { dataset: { type = "" } = {} } = params
        if (!type) return

        this.#onModalBodyClick(params)
      }
    })
  }

  closeModal = (enableCloseModalIfDisabled = true) => {
    if (enableCloseModalIfDisabled) {
      this.#closeModal = true
      this.#whenCloseModalIfDisabled = () => null
    }
    else if (!this.#closeModal) {
      this.#whenCloseModalIfDisabled()
      return
    }
    else if (!this.isModalActive()) return

    this.#element.classList?.remove(this.#modalActiveClass)
    unsetOverlay(this.#overlayId)
  }

  activeModal = ({ useDoneButton = null, closeModal = true, whenClose = () => null, ...params }) => {

    useBreakDownIntoComponents({
      childIdentifier: this.#childIdentifier,
      parentIdentifier: this.#parentIdentifier,
      element: this.#element,
      params
    })

    if (useDoneButton !== null) {
      const { footer } = breakDownIntoComponents(this.#element, {
        childIdentifier: this.#childIdentifier,
        parentIdentifier: this.#parentIdentifier
      })

      footer.querySelector("button").hidden = !useDoneButton
    }

    this.#closeModal = closeModal
    this.#whenCloseModalIfDisabled = whenClose
    if (this.isModalActive()) return

    this.#element.classList?.add(this.#modalActiveClass)
    setOverlay(this.#overlayId)
  }

  isModalActive = () => this.#element.classList?.contains(this.#modalActiveClass)
}