import { appContext, data, destinationModel, halfPageModal, headerModalMessage, headerPrintMessage, iterateForRenderElementHTML, modalFooter, renderElementHTML, renderHTMLValues, renderSenderValuesHTML, senderModel, useReducer } from "./index.js"
import { SearchComponent } from "../../components/index.js"
import { useDeferredValue } from "../../helpers/index.js"
import { usePrint } from "./ops.js"

useReducer.init({
    onHideContent: ({ target, entry, context }) => {
        const section = entry.querySelector("#renderContentSectionContainer")

        section.classList.toggle("translateXContainer")
        target.classList.toggle("translateXButton")
        const { onRenderData: { element } } = context()

        element.classList.toggle("applyWidth")
    },

    onSelectData: ({ target }) => {
        if (target.tagName === "INPUT") return
        const id = target.closest("[data-id]").dataset.id

        usePrint({
            currentData: data.filter(el => el.nit === id)
        })
    },

    onClickCompanyRender: async () => {
        const values = await senderModel.find({
            w: {
                different: {
                    isFavorite: "1"
                }
            }
        })

        halfPageModal.activeModal({
            body: (element) => element.innerHTML = `
                <div class='halfPageModalBodyContainer'>${iterateForRenderElementHTML(values)}</div>
            `
        })
    },

    // handleCheckboxChange: ({ target }) => {
    //     
    // }
})

useReducer.render({
    renderContainer: async ({ element }) => {
        data.forEach(params => {
            element.innerHTML += renderElementHTML(params)
        })
        SearchComponent({
            inputPlaceholder: "Buscar por",
            onInput: ({ data, value }) => useDeferredValue(() => {
                if (data.length === 0) {
                    element.innerHTML = `
                    <div class='renderDataChild'>
                        <h2>No hay datos que correspondan con ${value}</h2>
                    </div>
                    `
                    return
                }

                element.innerHTML = ""
                data.forEach(params => {
                    element.innerHTML += renderElementHTML(params)
                })
            }),

            dataOptions: {
                data,
                filterBy: "nit"
            },

            onSearch: usePrint
        })
    },

    renderSenderValues: async ({ element }) => {
        const [sender] = await senderModel.find({
            w: {
                continue: {
                    isFavorite: "1"
                }
            }
        })

        if (!sender) {
            const values = await senderModel.find({
                w: {
                    different: {
                        isFavorite: "1"
                    }
                }
            })

            if (!values || !values?.length) {
                modalFooter.active({
                    isSuccess: false,
                    message: "No tienes remitentes creados",
                    useErrorTitle: true,
                    useSuccessTitle: false,
                    duration: 3000,
                })

                setTimeout(() => {
                    window.location.href = "../../index.html"
                }, 1000)
                return
            }

            halfPageModal.activeModal({
                body: (element) => element.innerHTML = `
                    <div class='halfPageModalBodyContainer'>${iterateForRenderElementHTML(values)}</div>
                `,
                closeModal: false,
                whenClose: () => {
                    modalFooter.active({
                        isSuccess: false,
                        message: "Selecciona el remitente apartir del cual vas a obtener rotulos...",
                        useErrorTitle: true,
                        useSuccessTitle: false,
                        duration: 3000,
                    })
                }
            })
            return
        }

        element.innerHTML = renderSenderValuesHTML(sender)
    }
})

useReducer.useListener({
    mousemove: {
        onSelectData: async ({ dataset: { id }, type }) => {
            if (type !== "renderChild") return
            else if (appContext.current.hoverElementId === id) {
                headerModalMessage.activeModalHeader({})
                return
            }

            const destination = data.find(d => d.nit === id)

            if (!destination) return

            headerModalMessage.activeModalHeader({
                body: (element) => element.innerHTML = renderHTMLValues(destination)
            })

            appContext.current = {
                ...appContext.current,
                hoverElementId: id
            }
        }
    }
})

useReducer.ownListener("input")({
    inputPrintQuantity: ({ target }) => {

        const id = target.closest("[data-id]")?.dataset?.id
        if (target.type === "number") {
            if (parseInt(target?.value) <= 0) {
                target.value = 1
            }
            const index = appContext.current.idsKeeper.findIndex(d => d.id === id)
            if (index === -1) return

            appContext.current.idsKeeper.splice(index, 1, {
                id,
                value: +target.value || 1
            })
            return
        }

        const inputText = target.parentElement.querySelector("input[type='number']")
        if (!id) {
            target.checked = false
        }
        else if (!target.checked || appContext.current.idsKeeper.some(d => d.id === id)) {
            appContext.current = {
                ...appContext.current,
                idsKeeper: appContext.current.idsKeeper.filter(el => el.id !== id)
            }
            inputText.hidden = true
        }
        else {
            appContext.current.idsKeeper.push({
                id,
                value: +inputText.value
            })
            inputText.hidden = false
            headerPrintMessage.activeModalHeader({})
        }
    }
})