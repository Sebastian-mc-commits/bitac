import { useSignalJs } from "../../helpers/index.js"

export default class {

  #id
  #componentName
  #componentBodyChildId
  #componentBodyId
  #componentBodyHTML
  constructor ({id, componentName, componentBodyChildId, componentBodyId, componentBodyHTML}) {
    this.#id = id
    this.#componentName = componentName
    this.#componentBodyChildId = componentBodyChildId
    this.#componentBodyId = componentBodyId
    this.#componentBodyHTML = componentBodyHTML
    this.onContentClick = useSignalJs(() => { })

  }

  get id () {
    return this.#id
  }

  get componentName () {
    return this.#componentName
  }

  get componentBodyChildId () {
    return this.#componentBodyChildId
  }

  get componentBodyId () {
    return this.#componentBodyId
  }

  get componentBodyHTML () {
    return this.#componentBodyHTML
  }

  _idSelector () {
    return {
      main: `[data-${this.#componentName}='${this.#id}']`,
      others: `[data-type-${this.#componentName}]`
    }
  }

  getBodyChildren = () => {
    const {[this.#componentBodyId]: componentBody} = this._getComponent()
    return Array.from(componentBody?.querySelectorAll("#" + this.#componentBodyChildId) || [])
  }

  _getComponent = () => {
    const {main, others} = this._idSelector()
    const component = document.querySelector(main)
    const a_componentTypes = Array.from(component.querySelectorAll(others))

    const componentTypes = {};
    const type = "type" + (this.#componentName[0].toUpperCase() + this.#componentName.slice(1))

    for (const target of a_componentTypes) {
      const { [type]: componentType = "" } = target?.dataset || {};

      if (!componentType) continue;

      componentTypes[componentType] = target;
    }
    return {
      [this.#componentName]: component,
      ...componentTypes
    };
  }

  _insert(target, HTML) {
    target.insertAdjacentHTML("afterbegin", HTML);
  }

  _insertParams = ({target, ...values}) => [(HTML) => this._insert(target, HTML), {target, ...values}]

  _modifyBody (callback) {
    const {[this.#componentBodyId]: body} = this._getComponent()
    callback(body, this.#componentBodyChildId);
  }
}