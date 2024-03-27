import Invoke from "../../invoke/index.js";
import TauriUtils from "../TauriUtils.js";

export default class extends Invoke {

    #tauriUtils

    constructor() {
        super()

        this.#tauriUtils = new TauriUtils()
    }

    _fetch = async (type) => await this.useInvoke({
        invokeType: type,
        errorCase: ({ custom_message = "Error inesperado" }) => this.#tauriUtils.message(custom_message)
    })

    _fetchWithParams = async (type, params) => await this.useInvoke({
        invokeType: type,
        errorCase: ({ custom_message = "Error inesperado" }) => this.#tauriUtils.message(custom_message),
        invokeValue: params
    })
}