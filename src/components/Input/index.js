import { UseReducer, setLinkStyles } from "../../helpers/index.js";
import Helper from "../Helper.js";
import isValidReducer from "../../utils/functions/isValidReducer.js";
import { breakDownIntoComponents } from "../componentUtilities.js";

export default class Input {

  #errorClass = "error"
  #errorNoFound = "noErrorFound"
  #parentIdentifier = "[data-form-handler-c]"
  #childIdentifier = "formHandlerC"
  #submitHandler
  #buttonTitle
  #helperMethods
  #params
  static whenChangeFormState = () => null
  #forbiddenValues = {
    nit: [{
      value: "",
      customMessage: ""
    }]
  }
  static #instances = []
  constructor({
    id,
    buttonTitle,
    submitHandler,
    params = [{
      spanTitle: "",
      input: {
        type: "",
        placeholder: "",
        defaultValue: ""
      },
      labelFor: "",
      inputName: "",
      oninput: () => null
    }],
    whenFormValid = () => null
  }) {

    this.#params = params
    this.#submitHandler = submitHandler
    this.#buttonTitle = buttonTitle
    this.whenFormValid = whenFormValid
    this.#helperMethods = new Helper()
    this.#initialize(id)
  }

  #initialize = async (id) => {
    await this.#helperMethods._initialize({
      componentHTML: this.#componentHTML,
      componentTag: "component-form-handler",
      connectedCallbackOptions: () => setLinkStyles(import.meta.url),
      id,
      idSelector: `[data-form-handler='${id}']`,
      params: this.#params,
      whenDefined: this.#init
    })

    this.#helperMethods._whenDefined()
    Input.#instances.push(this.isFormValid)
  }

  #getElements = () => {
    let elements = {
      submitButton: null
    }
    let isValid = false

    const components = breakDownIntoComponents(this.#helperMethods.element, {
      parentIdentifier: this.#parentIdentifier,
      childIdentifier: this.#childIdentifier
    })

    if (components) {
      elements = components
      isValid = true
    }

    return {
      elements,
      isValid
    }

  }

  getFormData = () => {
    const formData = new FormData(this.#helperMethods.element)
    const data = Object.fromEntries(formData)

    return {
      formData,
      data
    }
  }

  #init = (element) => {
    const useReducer = new UseReducer({
      entries: element,
      isArray: false,
      name: "form"
    })

    useReducer.init({
      submit: (params) => {
        params.event.preventDefault()
        const formData = new FormData(params.entry)
        const data = Object.fromEntries(formData)

        this.#submitHandler({
          ...params,
          formData,
          data,
          id: this.#helperMethods.id
        })
      }
    })

    useReducer.ownListener("input")({
      formComponent: ({ target }) => {
        this.toggleInputError({
          inputParam: target,
        }, {})
      }
    })
  }

  #componentHTML = (params) => {

    let HTML = ""
    for (const { input: { defaultValue, placeholder, type }, inputName, labelFor, spanTitle } of params) {
      HTML += `
        <label for='${labelFor}' class='inputContainer'>
          <span>${spanTitle}</span>
          <input type='${type}' placeholder='${placeholder}' value='${defaultValue}' name='${inputName}' id='${labelFor}' data-error='true' autocomplete='off'/>
          <span id='error' class='noErrorFound'></span>
        </label>
      `
    }

    const form = document.createElement("form")
    form.dataset.formType = "formComponent"
    form.innerHTML = `
    ${HTML}
    <button data-form-type='submit' data-form-handler-c='submitButton' disabled>${this.#buttonTitle} <span></span></button>
    `

    return form
  }


  toggleInputError = ({ id = null, inputParam = null }, {
    setError = false,
    customMessage = () => "",
    useForbiddenValue = false
  }) => {
    const input = inputParam || this.#helperMethods.element.querySelector(`input[id='${id}']`)
    const errorTag = input.parentElement.querySelector("#error")
    const { elements: { submitButton } } = this.#getElements()
    const { value, name } = input
    const inputParams = this.#params.find(p => p.inputName === name)
    const isForbid = Array.isArray(this.#forbiddenValues[name]) ? this.#forbiddenValues[name].find(f => f.value === value) : null

    if (inputParams && "oninput" in inputParams) inputParams.oninput(input)

    const { error, hasError } = isValidReducer(value, name)

    if (hasError || setError) {
      const newError = setError ? customMessage(value) : error
      this.#setError(input, newError)
      if (useForbiddenValue) {
        this.#forbiddenValues[id || name] = [
          ...(this.#forbiddenValues[id || name] || []),
          {
            value,
            customMessage: newError
          }
        ]
      }
      return
    }
    else if (isForbid) {
      this.#setError(input, isForbid.customMessage)
      return
    }
    else if (input.dataset.error === "true" && errorTag.classList.contains(this.#errorClass)) {
      errorTag.className = this.#errorNoFound
      input.dataset.error = "false"
      submitButton.querySelector("span").textContent = "Llena los demas campos"
    }

    if (this.isFormValid()) {
      this.enableSubmitButton()
    }
  }

  isFormValid = () => {

    let isValid = true
    for (const input of this.#inputs()) {
      if (input.dataset.error === "true") {
        isValid = false
        break
      }
    }

    return isValid
  }

  #setError = (input, errorMessage) => {
    const errorTag = input.parentElement.querySelector("#error")
    input.dataset.error = "true"
    errorTag.className = this.#errorClass
    errorTag.textContent = errorMessage

    this.disableSubmitButton(errorMessage)
  }

  disableSubmitButton = (error = "") => {
    const { submitButton } = this.#getElements().elements
    submitButton.querySelector("span").textContent = error ? `. Error ( ${error} )` : ""
    if (!submitButton.disabled) submitButton.disabled = true
    Input.whenChangeFormState(Input.#instances.every(fn => fn()))
  }

  enableSubmitButton = () => {
    const { submitButton } = this.#getElements().elements
    submitButton.querySelector("span").textContent = ""
    if (submitButton.disabled) submitButton.disabled = false
    this.whenFormValid()
    Input.whenChangeFormState(Input.#instances.every(fn => fn()))
  }

  #inputs = () => Array.from(this.#helperMethods.element.querySelectorAll("input"))

  setInputValues = (params = [{ id, value }]) => {
    for (const input of this.#inputs()) {
      const param = params.find(p => p.id === input.id)
      if (!param) continue

      input.value = param.value
    }
  }

  setFormValid = () => {

    for (const input of this.#inputs()) {
      if (input.dataset.error === "false") continue

      const errorTag = input.parentElement.querySelector("#error")
      errorTag.className = this.#errorNoFound
      input.dataset.error = "false"
    }

    this.enableSubmitButton()
  }

  reloadForm = () => {
    for (const input of this.#inputs()) {

      const errorTag = input.parentElement.querySelector("#error")
      errorTag.className = this.#errorNoFound
      input.dataset.error = "true"
      input.value = ""
    }

    this.disableSubmitButton()
  }

  useLoader = () => {
    const button = this.#getElements().elements.submitButton
    button.disabled = true
    button.querySelector("span").textContent = "Cargando."
  }

  disableLoader = () => {
    this.enableSubmitButton()
  }
}