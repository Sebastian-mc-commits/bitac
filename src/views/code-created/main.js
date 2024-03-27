import { constants, dataTransfer, useReducer } from "./index.js";

useReducer.init({
    reGenerateCode: async () => {
        if (constants.CODE.length > 0) {
            await dataTransfer.removeCode(constants.CODE)
        }
    },

    copyCode: async () => {

        await navigator.clipboard.writeText(constants.CODE)

    }
})

useReducer.render({
    setCode: async ({ element }) => {
        let code = await dataTransfer.getStoredCode()
        constants.CODE = code

        if (code?.length > 4) {
            code = code.slice(0, 4) + "..."
        }

        element.textContent = code
    }
});
