import { bounceComponent, codeState, dataTransfer, pageLoader, tauriUtils, useReducer } from "./index.js";

useReducer.init({
  changeFormState: () => {
    bounceComponent.next()
  },

  getCode: async () => {
    pageLoader.active()
    const code = await dataTransfer.generatesCode()

    console.log("Code: ", code)
  },

  setDataByCode: async ({ context }) => {
    const { code: { element: codeElement } } = context()

    if (codeElement.value.length === 0) {
      tauriUtils.message("Código Invalido")
      return
    }

    const code = await dataTransfer.setDataByCode("ZZ29YFFDZKZ7FUYQNCNTC")
    console.log(code)
  },

  changeCodeOpsState: () => {
    codeState.next()
  }
})