import { UseReducer } from "../../helpers/index.js";
import { DataTransfer } from "../../models/backup/index.js";

export const useReducer = new UseReducer({
  entries: document.querySelector("#mainContainer"),
  isArray: false
})

export const constants = {
  CODE: ""
}

export const dataTransfer = new DataTransfer()