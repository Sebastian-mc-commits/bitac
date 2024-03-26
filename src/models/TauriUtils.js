
export default class {

    constructor() {
        const { message, confirm } = window.__TAURI__.dialog

        this.message = message
        this.confirm = confirm
    }
}