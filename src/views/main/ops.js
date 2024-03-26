import { cityModel, constants, destinationForm, destinationModel, halfPageModal, modalFooter, senderForm, senderModel, transporterModel, viewContext } from "./index.js"

export const modalBodyClick = ({ target }) => ({
  selectValues: async () => {
    const id = target.closest("[data-id]")
    if (!id) return

    const validate = viewContext.current.isSenderForm

    const newRender = validate ? senderModel : destinationModel

    const [data] = await newRender.find({
      w: {
        continue: {
          nit: id.dataset.id
        }
      }
    })

    const newData = Object.keys(data).map(key => ({
      id: key,
      value: data[key]
    }))

    const form = validate ? senderForm : destinationForm
    form.setInputValues(newData)
    form.setFormValid()
    halfPageModal.closeModal()
  }
})

export const selectsData = () => {

  const forms = document.querySelectorAll(constants.formSelectSelector)
  let values = {
    forms,
    sender: {
      cityId: null,
      transporterId: null,
      draw: null
    },
    destination: {
      cityId: null
    }
  }

  Array.from(forms).forEach(el => {
    const formData = new FormData(el)
    const data = Object.fromEntries(formData)
    values = {
      ...values,
      [el.dataset.type]: data
    }
  })

  return values
}

export const contextViewSubmitHandler = async ({ data: { nit, name, phoneNumber, locationDescription }, target, id }) => {

  const { SENDER_ID, formSelectSelector, mainContainerSelector } = constants
  const form = target.closest(mainContainerSelector).querySelector(formSelectSelector)
  const formData = new FormData(form)
  const { cityId, draw, ...selectsData } = Object.fromEntries(formData)
  const isFromSender = id === SENDER_ID
  let message = "Hubo un error insertando los datos"
  let title = "🥺"
  let isSuccess = false

  if (isFromSender) {
    selectsData.transporterId = {
      Usize: +selectsData?.transporterId || 0
    }

    selectsData.isFavorite = {
      Usize: 0
    }
  }

  const newModel = isFromSender ? senderModel : destinationModel
  const contextForm = isFromSender ? senderForm : destinationForm

  const existId = await newModel.exists({
    continue: {
      nit
    }
  })

  const existName = await newModel.exists({
    continue: {
      name
    }
  })

  contextForm.useLoader()
  let useDisabledLoader = true
  if (existId) {
    contextForm.toggleInputError({
      id: "nit",
    }, {
      setError: true,
      customMessage: value => `El nit: ${value} ya existe`,
      useForbiddenValue: true
    })
    return
  }
  else if (existName) {
    contextForm.toggleInputError({
      id: "name",
    }, {
      setError: true,
      customMessage: value => `El nombre: ${value} ya existe`,
      useForbiddenValue: true
    })
    return

  }
  else if (!cityId) {
    message = "Debes seleccionar una ciudad"
    title = "😡"
  }
  else if (isFromSender && !selectsData.transporterId.Usize) {
    message = "Debes de seleccionar un transportador"
    title = "🚫"
  }
  else {
    const isInserted = await newModel.insert({
      nit: {
        Str: nit
      },
      name: {
        Str: name
      },
      phoneNumber: {
        Str: phoneNumber
      },
      locationDescription: {
        Str: locationDescription
      },
      cityId: {
        Usize: +cityId
      },
      ...selectsData
    })

    if (isInserted) {
      message = "Elementos insertados satisfactoriamente"
      title = "👍"
      isSuccess = true
      useDisabledLoader = false
      contextForm.reloadForm()
    }
  }

  if (useDisabledLoader) {
    contextForm.disableLoader()
  }

  modalFooter.active({
    isSuccess,
    message,
    title,
    duration: 3500
  })
}

export const setPrintData = async quantity => {
  const { data: senderData } = senderForm.getFormData()
  const { data: destinationData } = destinationForm.getFormData()
  const { destination: { cityId: d_cityId }, sender: { cityId: s_cityId, draw, transporterId } } = selectsData()

  const [[newDestinationCity], [newSenderCity], [newTransporter]] = await Promise.all([
    cityModel.find({
      w: {
        continue: {
          id: d_cityId
        }
      }
    }),
    cityModel.find({
      w: {
        continue: {
          id: s_cityId
        }
      }
    }),
    transporterModel.find({
      w: {
        continue: {
          id: transporterId
        }
      }
    })
  ])

  return Array(quantity).fill({
    sender: {
      ...senderData,
      draw,
      city: newSenderCity?.name,
      transporter: newTransporter?.name
    },
    destination: {
      ...destinationData,
      city: newDestinationCity?.name
    }
  })

}