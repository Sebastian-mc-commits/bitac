import { HeaderModalMessage } from "../../../components/index.js"
import { printWindow } from "../../../helpers/index.js"
import createPrintView from "./createPrintView.js"

export const printHeaderMessage = (printView, useInput = true) => {
  const opsContainer = document.createElement("div")
  opsContainer.style.cssText = `
    display: flex;
    gap: 1rem;
    align-items: center;
  `
  opsContainer.dataset.mdType = "onInputPrint"

  opsContainer.innerHTML = `
    <button class='radiusButton' data-type='printByPress'></button>
    ${useInput ? "<input placeholder='Cantidad de rotulos' value='1' type='text'/>" : ""}
  `

  return new HeaderModalMessage({
    id: "headerPrintMessage",
    header: "<h3>Imprimir</h3>",
    body: opsContainer.outerHTML,
    clickBodyHandler: async ({ dataset: { type }, target }) => {
      if (type !== "printByPress") return

      const { value } = target.parentElement.querySelector("input")

      printWindow(createPrintView(await printView(+value ?? 1)))
    },
    useReducer: R => R.ownListener("input")({
      onInputPrint: ({ target }) => {
        const value = +target.value

        if (value < 0) {
          target.value = 1
        }
      }
    })
  })
}
