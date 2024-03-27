export default class {

  constructor() {
    this.invokeTypes = {
      USE_SELECT: "use_select",
      USE_UPDATE: "use_update",
      SET_FAVORITE: "set_favorite",
      USE_INSERT: "use_insert",
      OBTAIN_SENDER_DETAILS: "obtain_sender_details",
      EXISTS: "exists",
      OBTAIN_DESTINATION_DETAILS: "obtain_destination_details",
      USE_DELETE: "use_delete",
      GENERATE_CODE: "generate_code",
      OBTAIN_TRANSFERRED_DATA_BY_CODE: "obtain_transferred_data_by_code",
      SET_DATA_BY_CODE: "obtain_transferred_data_by_code_and_set",
      GET_STORED_CODE: "get_stored_code",
      DELETE_DATA_BY_CODE: "delete_data_by_code"
    }
  }

  useInvoke({ invokeType, invokeValue, errorCase }) {
    if (!("__TAURI__" in window)) return null

    const { invoke } = window.__TAURI__

    return invoke(invokeType, invokeValue)
      .then(result => {

        this.hasError = false

        return result
      })
      .catch(err => {
        errorCase(err)
        this.hasError = true
        return err
      })
  }
}