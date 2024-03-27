import BackupGlobal from "./BackupGlobal.js"

export default class extends BackupGlobal {

    constructor() {
        super()
    }

    generatesCode = async () => await this._fetch(this.invokeTypes.GENERATE_CODE)

    getDataByCode = async (code) => await this._fetchWithParams(
        this.invokeTypes.OBTAIN_TRANSFERRED_DATA_BY_CODE,
        { code }
    )

    setDataByCode = async (code) => await this._fetchWithParams(
        this.invokeTypes.SET_DATA_BY_CODE,
        { code }
    )

    removeCode = async (code) => this._fetchWithParams(
        this.invokeTypes.DELETE_DATA_BY_CODE,
        { code }
    )

    getStoredCode = async () => await this._fetch(this.invokeTypes.GET_STORED_CODE)
}