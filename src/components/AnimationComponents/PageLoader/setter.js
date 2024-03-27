import { setLinkStyles } from "../../../helpers/navigation.js";
import Helper from "../../Helper.js";

//data-bounce
export default class PageLoaderSetter {

    #identifier = "[data-page-loader-id]"
    #selectIdentifier = "pageLoaderId"

    _pageLoaderStyles = {
        pageContainer: "blank-page-loader",
        activePageLoader: "active-page-loader",
    }

    constructor({ id }) {

        this._helperMethods = new Helper()

        this.#initialize(id)
    }

    #initialize = async (id) => {
        await this._helperMethods._initialize({
            id,
            idSelector: `[data-page-loader='${id}']`,
            componentTag: "component-page-loader",
            connectedCallbackOptions: this.#effect,
            componentHTML: this.#componentHTML,
            whenDefined: this.#whenDefined,
            firstSelect: this.#identifier
        })
        this._helperMethods._whenDefined()
    }

    #componentHTML = () => {

        const { pageContainer } = this._pageLoaderStyles
        const component = document.createElement("div")
        component.className = pageContainer
        component.dataset.pageLoaderId = "loaderContainer"

        return component
    }

    #whenDefined = () => {

        const loaderContainer = this._helperMethods.element
        const mainComponent = loaderContainer.parentElement
        this.children = mainComponent.querySelectorAll(`:not(${this.#identifier})`)

        if (this._helperMethods.id == "2") {
            console.log(this)
        }

        for (const child of this.children) {
            loaderContainer.append(child)
        }

    }

    /**
     * @param {HTMLElement} componentObject 
     */
    #effect = async () => {

        setLinkStyles(import.meta.url)
    }
}