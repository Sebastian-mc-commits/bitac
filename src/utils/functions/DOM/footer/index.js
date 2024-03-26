import { unsetOverlay } from "../../../../components/overlay/index.js"

class Footer extends HTMLElement {

  constructor() {
    super()

    const shadow = this.attachShadow({
      mode: "open"
    })

    const styles = new CSSStyleSheet()

    styles.replaceSync(`
    .footer {
        background-color: #333;
        color: #fff;
        padding: 20px 0;
        text-align: center;
        position: absolute;
        top: 130%;
        left: 0;
        width: 100%;
        z-index: 100;
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    h3 {
        font-size: 1.5em;
        margin: 0;
    }
    
    p {
        margin: 10px 0;
    }
    
    `)

    shadow.adoptedStyleSheets.push(styles)
    shadow.innerHTML = `
    <footer class="footer">
      <div class="container">
          <h3>Bitac</h3>
          <p>&copy; 2024. Enjoy :)</p>
      </div>
    </footer>
    `
  }

  connectedCallback() {
    setTimeout(() => {
      unsetOverlay("data-overlay-body")
    }, 200)
  }
}

customElements.define("component-footer", Footer)