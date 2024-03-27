import { delay } from "../../lib/threads/thread.js";
import { bounceComponent, codeRender, codeState, dataTransfer, dots, pageLoader, pageLoader_2, tauriUtils, useReducer } from "./index.js";

useReducer.init({
  changeFormState: () => {
    bounceComponent.next()
  },

  getCode: async () => {
    pageLoader.active()
    codeRender.init("NOTHING")
    const code = await dataTransfer.generatesCode()

    if (dataTransfer.hasError) {
      codeRender.stop("NOTHING")
      pageLoader.inactive()
      return
    }

    codeRender.stop(code.code)
    await delay(900)
    location.href = "../code-created/index.html"
  },

  setDataByCode: async ({ context }) => {
    const { code: { element: codeElement } } = context()
    dots.init()
    pageLoader_2.active()

    if (codeElement.value.length === 0) {
      tauriUtils.message("Código Invalido")
      pageLoader_2.inactive()
      return
    }

    await dataTransfer.setDataByCode(codeElement.value)

    if (dataTransfer.hasError) {
      pageLoader_2.inactive()
      return
    }

    const on = dots.setTextAndRestore("¡Código en uso!")
    await delay(1000)
    pageLoader_2.inactive(on)
    location.href = "../code-created/index.html"
  },

  changeCodeOpsState: () => {
    codeState.next()
  }
})