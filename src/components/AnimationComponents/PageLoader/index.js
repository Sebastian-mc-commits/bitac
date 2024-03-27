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

    inactive = (whenClose = () => { }) => {
        const loaderContainer = this._helperMethods.element

        loaderContainer.classList.remove(this._pageLoaderStyles.activePageLoader)
        setTimeout(whenClose, 500)
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

    activeWithHTML = (HTML) => {
        const loaderContainer = this._helperMethods.element

        const prevHTML = loaderContainer.innerHTML

        loaderContainer.innerHTML = HTML

        this.active()

        return () => {
            this.inactive()
            setTimeout(() => {
                loaderContainer.innerHTML = prevHTML
            }, 500)
        }
    }

}