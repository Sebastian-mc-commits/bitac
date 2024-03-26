import { setLinkStyles, toggleTypes } from "../../../helpers/index.js"
import { breakDownIntoComponents } from "../../componentUtilities.js"

export default class {

  #id = "modalFooterMessage"
  #idSelector = "#" + this.#id
  #componentTag = "component-modal-footer"
  #element
  #childIdentifier = "modalFooterType"
  #parentIdentifier = "[data-modal-footer-type]"
  #activeClass = "showFooterMessage"
  #successToggleType = toggleTypes(["👍", "❤️", "😁", "👌", "😊"])
  #errorToggleType = toggleTypes(["😡", "🥺", "🚫", "😑", "😖"])
  constructor() {

    customElements.define(this.#componentTag, this.#component())
    customElements.whenDefined(this.#componentTag)
      .then(() => {
        this.#element = document.querySelector(this.#idSelector)
      })
  }

  #component = () => class extends HTMLElement {
    constructor() {
      super()

      this.innerHTML = `
      <section class="modalFooterMessage" id='modalFooterMessage'>
      <img alt="sadness" data-modal-footer-type='imageComponent'>
      <div class="message">
        <h3 data-modal-footer-type='titleComponent'></h3>
        <p data-modal-footer-type='messageComponent'></p>
      </div>
    </section>
      `
    }
    connectedCallback() {
      setLinkStyles(import.meta.url)
    }
  }

  #getElements = () => {
    let components = {
      titleComponent: "",
      messageComponent: "",
      imageComponent: ""
    }

    const getComponents = breakDownIntoComponents(this.#element, {
      childIdentifier: this.#childIdentifier,
      parentIdentifier: this.#parentIdentifier
    })

    if (getComponents) components = getComponents

    return components
  }

  active = ({ isSuccess, message, title = "", duration = 3000, useSuccessTitle, useErrorTitle }) => {
    const { imageComponent, messageComponent, titleComponent } = this.#getElements()
    let newTitle = ""
    if (useSuccessTitle) newTitle = this.#successToggleType.getValue
    else if (useErrorTitle) newTitle = this.#errorToggleType.getValue
    else newTitle = title

    titleComponent.textContent = newTitle
    messageComponent.textContent = message
    imageComponent.src = `../../../assets/${isSuccess ? "success" : "error"}.jpg`
    this.#element.classList.add(this.#activeClass, "shake")

    setTimeout(() => {
      this.#element.classList.remove(this.#activeClass)
    }, duration)
  }

}