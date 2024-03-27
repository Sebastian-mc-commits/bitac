import { breakDownIntoComponents } from "./componentUtilities.js"

export default class {

  _initialize = async ({
    id,
    idSelector,
    componentTag,
    componentHTML,
    params,
    connectedCallbackOptions = () => null,
    whenDefined = () => null,
    firstSelect = ""
  }) => await new Promise(resolve => {

    this.id = id
    this._idSelector = idSelector
    this._componentTag = componentTag
    this._componentHTML = componentHTML

    const isComponentCreated = customElements.get(this._componentTag)

    if (!isComponentCreated) {
      customElements.define(this._componentTag, this.#component(connectedCallbackOptions))
      customElements.whenDefined(this._componentTag)
        .then(() => {
          const component = document.querySelector(this._idSelector)
          component.prepend(this._componentHTML(params))
          this.element = firstSelect ? component.querySelector(firstSelect) : component.firstChild
          this._whenDefined = () => whenDefined(this.element)
        })
      resolve()
      return
    }

    const component = document.querySelector(this._idSelector)
    component.prepend(this._componentHTML(params))
    this.element = firstSelect ? component.querySelector(firstSelect) : component.firstChild

    this._whenDefined = () => whenDefined(this.element)
    resolve()
  })


  #component = (connectedCallbackOptions) => class extends HTMLElement {
    constructor() {
      super()

      this.connectedCallbackOptions = connectedCallbackOptions
    }

    connectedCallback() {
      this.connectedCallbackOptions(this)
    }

  }

  _getComponents(parentIdentifier, childIdentifier) {
    return breakDownIntoComponents(this.element, {
      parentIdentifier,
      childIdentifier
    })
  }

}