import { setLinkStyles } from "../../helpers/navigation.js"

function Component(
    {
        inputPlaceholder,
        onSearch = () => null,
        dataOptions = {
            filterBy,
            data
        },
        onInput = () => null
    }
) {

    setLinkStyles(import.meta.url)
    return class extends HTMLElement {

        #elementBody
        #filteredData
        constructor() {
            super()

            this.#elementBody = `
                <div class='search-body-container'>
                    <label>
                        <input type='search' placeholder='${inputPlaceholder}' />
                        <input data-type='searchButton' type='submit' value='Buscar' />
                    </label>
                </div>
            `
            this.element = document.createElement("form")
            this.element.innerHTML = this.#elementBody
            this.searchButton = document
            this.#filteredData = dataOptions?.data ?? []


            this.appendChild(this.element)
        }

        connectedCallback() {
            this.searchButton = this.element.querySelector("#searchButton")
            this.element.addEventListener("click", (e) => {
                e.preventDefault()
                switch (e.target.dataset.type) {
                    case this.#types().SEARCH_BUTTON: {
                        onSearch({
                            event: e,
                            currentData: this.#filteredData
                        })
                        break
                    }
                }
            })

            this.element.addEventListener("input", this.#onInput)
        }

        #types = () => ({
            SEARCH_BUTTON: "searchButton"
        })

        #onInput = (e) => {
            const newValue = String(e.target.value).replace(/\s+/g, " ")
            e.target.value = newValue

            const { data, filterBy } = dataOptions
            this.#filteredData = data.filter(val => String(val[filterBy]).toLocaleLowerCase().includes(newValue.toLocaleLowerCase().trim()))

            onInput({
                data: this.#filteredData,
                value: newValue,
                event: e
            })
        }
    }
}

export default (params) => {
    if ("customElements" in window) {
        customElements.define("c-search", Component(params))
    }
}