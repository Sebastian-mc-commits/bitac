import { setOverlay } from "../../../../components/overlay/index.js"
import { setLinkStyles } from "../../../../helpers/navigation.js"
import { methods, onView } from "./events/index.js"

class Header extends HTMLElement {

  constructor() {

    super()
    setOverlay("data-overlay-body")
    const shadow = this.attachShadow({
      mode: "open"
    })

    if (this.dataset?.showHeader && this.dataset.showHeader === "false") return
    shadow.innerHTML = `
    <div class='header-menu'>
    <h3>Bitac</h3>
    </div>
    `

    const styles = new CSSStyleSheet()
    styles.replaceSync(`
    .header-menu {
      background-color: #f8f8f8; /* Background color */
      padding: 10px; /* Padding around the content */
      border-bottom: 2px solid #ccc; /* Bottom border */
      text-align: center; /* Center the text */
    }
    
    .header-menu h3 {
      margin: 0;
      font-size: 1.5em;
      color: #333;
    }
    `)
    shadow.adoptedStyleSheets.push(styles)
  }

  connectedCallback() {
    setTimeout(() => {
      document.body.hidden = false
    }, 500)
    const { event = {} } = window.__TAURI__
    event?.listen("view", onView)
    event?.listen("methods", methods)
  }
}

customElements.define("component-header", Header)