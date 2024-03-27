import { UseReducer } from "../../helpers/index.js";

export const useReducer = new UseReducer({
    entries: document.querySelectorAll("#mainContainer"),
    isArray: true
  })