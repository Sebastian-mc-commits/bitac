import BounceSetter from "./setter.js";

export default class extends BounceSetter {

    constructor({ id }) {
        super({
            id
        })
    }

    active = () => {
        const loaderContainer = this._helperMethods.element

        loaderContainer.classList.add(this._pageLoaderStyles.activePageLoader)
    }

    inactive = () => {
        const loaderContainer = this._helperMethods.element

        loaderContainer.classList.remove(this._pageLoaderStyles.activePageLoader)
    }

    toggle = () => {
        if (this.isActive()) {
            this.inactive()
        }
        else {
            this.active()
        }
    }

    isActive = () => {
        const loaderContainer = this._helperMethods.element

        return loaderContainer.classList.contains(this._pageLoaderStyles.activePageLoader)
    }

}