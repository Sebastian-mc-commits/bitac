import BounceSetter from "./setter.js";

export default class extends BounceSetter {

    constructor({ id }) {
        super({
            id
        })

        this.isComponentLoad = true
    }

    next = () => {
        const { bounceBody } = this._elements()

        if (!this.isComponentLoad) return
        bounceBody.prepend(bounceBody.lastElementChild)
        this.set()
    }

    set = () => {
        const { bounceBody, loaderElement } = this._elements()
        this.isComponentLoad = false

        loaderElement.textContent = "0%"
        loaderElement.classList.remove(this._opacity)

        bounceBody.children[0].classList.add("bounce-effect")

        let counter = 0
        const counterInterval = setInterval(() => {
            if (counter >= 100) return clearInterval(counterInterval)
            counter += 10
            loaderElement.textContent = `${counter}%`
        }, 100)

        setTimeout(() => {
            bounceBody.children[0].classList.remove("bounce-effect")
            clearInterval(counterInterval)
            loaderElement.classList.add(this._opacity)
            this.isComponentLoad = true
        }, 1000)

    }

}