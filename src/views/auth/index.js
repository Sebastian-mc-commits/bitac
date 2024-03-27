import { BounceAnimation, CodeRender, Dots, Input, PageLoader } from "../../components/index.js";
import { UseReducer, toggleTypes } from "../../helpers/index.js";
import TauriUtils from "../../models/TauriUtils.js";
import { DataTransfer } from "../../models/backup/index.js";

export const constants = {
  USER_FORM_ID: "userFormId",
  LOGIN_FORM_ID: "logInFormId"
}

const toggleEmoji = toggleTypes([
  "😁",
  "👍",
  "😎",
  "👌",
  "😊",
  "❤️",
  "😶‍🌫️",
  "🙂"
]);

export const titleHTMLElement = () => document.querySelector("#title")

const formParams = [

  {
    input: {
      defaultValue: "",
      placeholder: "sm123@gmail.com",
      type: "email"
    },
    inputName: "email",
    labelFor: "email",
    spanTitle: "Correo"
  },

  {
    input: {
      defaultValue: "",
      placeholder: "****",
      type: "password"
    },
    inputName: "password",
    labelFor: "password",
    spanTitle: "Contraseña"
  }
]

export const userForm = new Input({
  buttonTitle: "Registrar usuario",
  id: constants.USER_FORM_ID,
  submitHandler: () => null,
  params: [
    {
      input: {
        defaultValue: "",
        placeholder: "Sebastian",
        type: "text"
      },
      inputName: "name",
      labelFor: "name",
      oninput: (target) => {
        if (target.value.length > 20) return

        titleHTMLElement().innerHTML = `${target.value} ${toggleEmoji.getValue}`
      },
      spanTitle: "Nombre"
    },
    ...formParams]
})

export const logInForm = new Input({
  buttonTitle: "Iniciar sesión",
  id: constants.LOGIN_FORM_ID,
  submitHandler: () => null,
  params: formParams
})

export const useReducer = new UseReducer({
  entries: document.querySelectorAll("#mainContainer"),
  isArray: true
})

export const dataTransfer = new DataTransfer()

export const bounceComponent = new BounceAnimation({
  id: "1"
})

export const codeState = new BounceAnimation({
  id: "2"
})

export const tauriUtils = new TauriUtils()

bounceComponent.init(
  bounceComponent.set
)

codeState.init(
  bounceComponent.set
)

export const pageLoader = new PageLoader({
  id: "1"
})

export const pageLoader_2 = new PageLoader({
  id: "2"
})

export const dots = new Dots({
  id: "1",
  title: "Cargando Datos"
})
export const codeRender = new CodeRender({
  id: "1",
  tag: "h2",
  word: "SDFKLDFSHL0SDFA6"
})