import loadDots from "../../../lib/dots/loadDots.js";
import Helper from "../../Helper.js";

//data-bounce
export default class PageLoaderSetter {

    constructor({ id, title, tag = "h2" }) {

        this._helperMethods = new Helper()
        this.title = title
        this.tag = tag
        this.isInit = false

        this.#initialize(id)
    }

    #initialize = async (id) => {
        await this._helperMethods._initialize({
            id,
            idSelector: `[data-dots='${id}']`,
            componentTag: "component-dots",
            componentHTML: this.#componentHTML,
        })
    }
    #componentHTML = () => {

        const component = document.createElement(this.tag)
        component.dataset.dotsId = "dotsTitle"
        component.textContent = this.title

        return component
    }

    init = () => {
        if (this.isInit) return
        this.dots = loadDots(this._helperMethods.element, true)
        this.isInit = true
    }

    stop = () => {
        if (!this.isInit) return
        this.dots()
        this.isInit = false
    }

    setTextAndRestore = (text) => {

        this.stop()
        this._helperMethods.element.textContent = text

        return () => {
            this._helperMethods.element.textContent = this.title
            this.init()
        }
    }

}