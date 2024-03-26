
export default class {

  #entries
  #callbackRegistry = {}
  #name
  #isArray
  #registeredListeners = []
  #customListeners = {
    DOUBLE_CLICK: "custom:doubleClick"
  }
  // #registeredFunctionsListener = {
  //   mouseenter: []
  // }

  constructor({
    entries = document.body,
    name = "reduce",
    isArray = true
  }) {

    this.#entries = entries
    this.#name = name
    this.#isArray = isArray
  }

  init = ({ ...fn }) => {

    this.#callbackRegistry = fn

    const { type } = this.#getDataset()
    this.#useEntry(entry => this.#setEventListener({
      entry,
      fn,
      eventListener: "click",
      type
    }))
  }

  #setEventListener = (
    {
      entry,
      fn,
      eventListener,
      type,
      useDatasetValidation = true,
      customFunctionValidation = null
    }
  ) => {
    entry?.addEventListener(eventListener, event => {
      event.stopPropagation()
      const { target } = event
      const dataset = Object.keys(target?.dataset).length ? target.dataset
        :
        target?.closest(`[data-${this.#name}-type]`)?.dataset

      if (
        ((!dataset || dataset[type] === "undefined") && useDatasetValidation)
        ||
        (customFunctionValidation !== null && !customFunctionValidation({ target, dataset, event }))
      ) {
        return
      }

      const callback = useDatasetValidation ? fn[dataset[type]] : fn
      if (typeof callback !== "function") return
      callback({
        target,
        event,
        dataset,
        type: dataset[type],
        entry,
        context: this.getContextFunctions
      })
    })

    this.#registeredListeners.push(eventListener)
  }

  //   #setListener = (entry, listener) => entry.addEventListener(listener, event => {
  // 
  //     console.log(this.#registeredFunctionsListener)
  //     this.#registeredFunctionsListener[listener].forEach(({ callback, params }) => {
  //       callback({
  //         ...params,
  //         isCalledByListener: true,
  //         event
  //       })
  // 
  //     })
  //   })

  //   #useOnListener = (callback, listener, { callbackName, ...callbackParams }) => {
  // 
  //     const isCallbackSet = this.#registeredFunctionsListener[listener].some(r => r.callbackName === r.callbackName)
  //     if (isCallbackSet) return
  // 
  //     this.#registeredFunctionsListener[listener].push({
  //       callback,
  //       params: callbackParams,
  //       callbackName
  //     })
  // 
  //     if (this.#registeredListeners.includes(listener)) return
  // 
  //     this.#useEntry(entry => this.#setListener(entry, listener))
  // 
  //     this.#registeredListeners.push(listener)
  //   }

  #useEntry = (resolver) => {
    if (this.#isArray) {
      Array.from(this.#entries).forEach(resolver)
      return
    }

    resolver(this.#entries)
  }

  getContextFunctions = () => {

    let obj = {}

    if (this.#isArray) {
      Array.from(this.#entries).forEach(entry => {
        if (!entry) return

        obj = {
          ...obj,
          ...this.#getContextFunction({
            entry
          })
        }
      })
    }

    else {
      obj = this.#getContextFunction({
        entry: this.#entries
      })
    }
    return obj

  }

  getRenderContextFunctions = () => {

    let obj = {}
    const { render } = this.#getDataset()
    this.#useEntry(entry => {
      obj = {
        ...obj,
        ...this.#getContextFunction({
          entry,
          dataset: `[data-${this.#name}-render]`,
          defaultType: render
        })
      }
    })

    return obj
  }

  getEntriesByDataType = (type) => {
    let obj = {}
    const dataType = "[data-type]"
    this.#useEntry(entry => {
      const matches = entry.matches(dataType)
      if (!matches) return

      obj[entry.dataset.type] = entry
    })

    return obj
  }

  #getContextFunction = ({
    entry,
    dataset = `[data-${this.#name}-type]`,
    defaultType = ""
  }) => {
    const obj = {}
    const children = Array.from(entry.querySelectorAll(dataset))
    if (!defaultType) {
      const { type } = this.#getDataset()
      defaultType = type
    }
    for (const value of children) {
      const key = value?.dataset?.[defaultType]
      if (!key) continue

      obj[key] = {
        element: value,
        callback: this.#callbackRegistry[key] ?? null
      }
    }

    return obj
  }

  #getDataset = () => ({
    type: this.#name + "Type",
    render: this.#name + "Render",
    custom: (type) => type + "Type"

  })

  render = ({ ...fn }) => {
    this.#useEntry(entry => this.#renderByMethod(entry, fn))
  }

  #renderByMethod = (entry, fn) => {
    const { render } = this.#getDataset()
    Array.from(entry.querySelectorAll(`[data-${this.#name}-render]`)).forEach(element => {

      const key = element?.dataset[render]
      const callback = fn[key]

      if (typeof callback !== "function") return

      callback({
        element,
        key
      })

    })
  }

  useListener = ({ ...listenerMethods }) => {

    const { custom } = this.#getDataset()
    for (const listener in listenerMethods) {

      for (const listenerMethod in listenerMethods[listener]) {
        let element = null
        this.#useEntry(entry => {
          const exists = entry?.querySelector(`[data-${listener}-type='${listenerMethod}']`)

          if (exists) {
            element = exists
          }
        })

        this.#setEventListener({
          entry: element,
          eventListener: listener,
          fn: listenerMethods[listener][listenerMethod],
          type: custom(listener) + "Child",
          useDatasetValidation: false,
          customFunctionValidation: ({ dataset }) => !!dataset[custom(listener) + "Child"]
        })
      }

    }
  }

  ownListener = (listener = "click") => {

    return ({ ...methods }) => {
      for (const key in methods) {
        this.#useEntry(entry => {
          const selector = `[data-${this.#name}-type='${key}']`
          const element = entry.matches(selector) ? entry : entry?.querySelector(selector)
          element?.addEventListener(listener, event => {
            event.stopPropagation()
            const { target } = event
            methods[key]({
              dataset: target?.dataset,
              event,
              target
            })
          })
        })
      }
    }
  }

  doubleClick = ({ clickTime = 500, ...methods }) => {

    this.#useEntry(entry => {

      for (const key in methods) {
        let lastClick = 0
        const MAX_DOUBLE_CLICK_TIME = clickTime
        const element = this.#useSelector(entry, key)
        element?.addEventListener(this.#customListeners.DOUBLE_CLICK, event => {
          methods[key]({
            event,
            target: event.target,
            entry,
            dataset: event?.dataset,
            type: event?.dataset?.type,
            detail: event.detail
          })

        })

        element?.addEventListener("click", e => {
          const timeBetweenClicks = e.timeStamp - lastClick

          if (MAX_DOUBLE_CLICK_TIME < timeBetweenClicks) {
            lastClick = e.timeStamp
            return
          }
          e.stopPropagation()

          lastClick = 0
          const doubleClickEvent = new CustomEvent(this.#customListeners.DOUBLE_CLICK, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
              timeBetweenClicks
            }
          })
          e.target.dispatchEvent(doubleClickEvent)
        })
      }
    })
  }

  #useSelector = (entry, key) => {
    const selector = `[data-${this.#name}-type='${key}']`
    return entry.matches(selector) ? entry : entry?.querySelector(selector)
  }
}
