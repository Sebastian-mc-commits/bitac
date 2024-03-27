import { CodeRender, Dots, PageLoader } from "../../components/index.js";
import { UseReducer } from "../../helpers/index.js";
import { DataTransfer } from "../../models/backup/index.js";

export const useReducer = new UseReducer({
  entries: document.querySelectorAll("#mainContainer"),
  isArray: true
})

export const constants = {
  CODE: ""
}

export const dataTransfer = new DataTransfer()
export const pageLoader = new PageLoader({
  id: "1"
})

export const dotsRender = new Dots({
  id: "2",
  title: "Regenerando Código"
})

export const codeRender = new CodeRender({
  id: "1",
  tag: "h2",
  word: "CDSFDFSDFSKJKNKJX"
})

export const pageLoader_2 = new PageLoader({
  id: "2"
})

export const dots = new Dots({
  id: "1",
  title: "Usando"
})
