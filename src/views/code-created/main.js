import { delay } from "../../lib/threads/thread.js";
import { codeRender, constants, dataTransfer, dots, dotsRender, pageLoader, pageLoader_2, useReducer } from "./index.js";

useReducer.init({
    reGenerateCode: async () => {
        pageLoader_2.active()
        dotsRender.init()

        codeRender.init()
        await dataTransfer.removeCode(constants.CODE)

        if (dataTransfer.hasError) {
            codeRender.stop("NOTHING")
            pageLoader_2.inactive()
            return
        }

        await delay(400)
        location.href = "../auth/index.html"
    },

    copyCode: async ({ context }) => {

        const { codeElement } = context()
        await navigator.clipboard.writeText(constants.CODE)

        codeElement.element.style.color = "var(--teal-green)"
        await delay(1000)
        codeElement.element.style.color = "black"

    },

    reSetData: async () => {
        pageLoader.active()
        dots.init()

        await dataTransfer.setDataByCode(constants.CODE)

        if (!dataTransfer.hasError) {
            let on = dots.setTextAndRestore("¡Código en uso!")
            await delay(1000)
            pageLoader.inactive(on)
        }
        else {
            pageLoader.inactive()
        }
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
    },

    setFullCode: async ({ element }) => {

        await new Promise(rs => {
            const interval = setInterval(() => {
                if (constants.CODE.length > 0) {
                    element.textContent = constants.CODE
                    clearInterval(interval)
                    rs()
                }
            }, 200)
        })
    },
});