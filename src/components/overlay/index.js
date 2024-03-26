
export const overlayClass = "disable-overlay"
export const setOverlay = (dataset = "") => {
  const overlay = document?.querySelector(`[${dataset}]`)
  if (overlay) {
    overlay.classList.remove(overlayClass)
    return
  }

  document.body.insertAdjacentHTML("beforebegin", `<div class='overlay' ${dataset}></div>`)
}

export const unsetOverlay = (dataset) => {
  const overlay = document?.querySelector(`[${dataset}]`)
  if (!overlay || overlay.classList.contains(overlayClass)) return

  // document.body.removeChild(overlay)}
  overlay.classList.add(overlayClass)
}
