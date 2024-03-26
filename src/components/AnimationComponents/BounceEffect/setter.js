import { setLinkStyles } from "../../../helpers/navigation.js";
import Helper from "../../Helper.js";

//data-bounce
export default class BounceSetter {

    #identifier = "[data-bounce-id]"
    #selectIdentifier = "bounceId"
    _opacity = "opacity"

    _bounceStylesObject = {
        bounceBody: "bouncing-body",
        bounceContainer: "bouncing-container",
        bounceEffect: "bounce-effect"
    }

    constructor({ id }) {
        this.sad = id
        this.isLoad = false
        this._helperMethods = new Helper()
        this.#initialize(id)

    }

    #initialize = async (id) => {
        await this._helperMethods._initialize({
            id,
            idSelector: `[data-bounce='${id}']`,
            componentTag: "component-bounce-animation",
            connectedCallbackOptions: this.#effect,
            componentHTML: this.#componentHTML,
            whenDefined: this.#whenDefined,
            firstSelect: this.#identifier
        })
        this._helperMethods._whenDefined()
        this.isLoad = true
    }

    #componentHTML = () => {

        const { bounceBody, bounceContainer } = this._bounceStylesObject
        const component = document.createElement("section")
        component.innerHTML = `
            <div class='${bounceBody}' data-bounce-id='bounceBody'>

            </div>
            <span data-bounce-id='loaderElement' class='bounce-loader ${this._opacity}'>0%</span>
        `
        component.className = bounceContainer
        component.dataset.bounceId = "bounceParent"

        return component
    }

    #whenDefined = () => {
        const { bounceBody } = this._elements()

        this.children = bounceBody.closest(this._helperMethods._componentTag).querySelectorAll(`div:not(${this.#identifier})`)
        for (const child of this.children) {
            bounceBody.append(child)
        }

        this.isLoad = true
    }

    _elements = () => {
        return this._helperMethods._getComponents(this.#identifier, this.#selectIdentifier)
    }

    /**
     * @param {HTMLElement} componentObject 
     */
    #effect = (componentObject) => {

        setLinkStyles(import.meta.url)

        componentObject.className = this._bounceStylesObject.bounceContainer
    }

    init = (callback) => {
        const interval = setInterval(() => {
            if (this.isLoad) {
                callback()
                return clearInterval(interval)
            }
        }, 100)
    }
}