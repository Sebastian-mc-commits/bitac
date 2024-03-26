import tableTypes from "../types/db/tables.types.js";
import Global from "./Global.js";

export default class extends Global {

  constructor() {
    super(tableTypes.CITY)
  }
}