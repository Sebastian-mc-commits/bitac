
export const breakDownIntoComponents = (element, { parentIdentifier, childIdentifier }) => {

  const componentKeeper = {}
  Array.from(element.querySelectorAll(parentIdentifier))
    .forEach(el => {
      const key = el.dataset[childIdentifier]

      if (!key) return
      componentKeeper[key.toString()] = el
    })

  return componentKeeper
}

export const useBreakDownIntoComponents = ({
  element,
  params,
  childIdentifier,
  parentIdentifier
}) => {
  if (Object.keys(params).length > 0) {
    const components = breakDownIntoComponents(element, {
      childIdentifier,
      parentIdentifier
    })

    for (const key in params) {
      const element = components[key]
      const callback = params[key]

      if (!element || typeof callback !== "function") continue

      callback(element)
    }
  }
}