import { delay, iterationThread } from "../../../lib/threads/index.js";
import Helper from "../../Helper.js";

//data-bounce
export default class PageLoaderSetter {

    constructor({ id, word, tag }) {

        this._helperMethods = new Helper()
        this.word = word
        this.tag = tag

        this.#initialize(id)
    }

    #initialize = async (id) => {
        await this._helperMethods._initialize({
            id,
            idSelector: `[data-code-changer='${id}']`,
            componentTag: "component-code-changer",
            componentHTML: this.#componentHTML,
        })

    }
    #componentHTML = () => {

        const component = document.createElement(this.tag)
        component.textContent = "*".repeat(this.word.length)

        return component
    }

    init = (replacementWord = "") => {

        this.currentIteration = iterationThread(
            this.word,
            this._helperMethods.element,
            async (opacity) => {
                if (replacementWord) {
                    opacity()
                    await delay(400)
                    this._helperMethods.element.textContent = replacementWord
                }
            }
        )
    }

    stop = (replacementWord = "") => {
        this.currentIteration(
            async (opacity) => {
                if (replacementWord) {
                    opacity()
                    await delay(400)
                    this._helperMethods.element.textContent = replacementWord
                }
            }
        )
    }
}