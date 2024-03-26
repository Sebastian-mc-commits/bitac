import tableTypes from "../types/db/tables.types.js";
import Global from "./Global.js";

export default class extends Global {

  constructor() {
    super(tableTypes.DESTINATION)
  }

  obtainDestinationDetails = async (w = null) => await this.useInvoke({
    invokeType: this.invokeTypes.OBTAIN_DESTINATION_DETAILS,
    invokeValue: w,
  })
}