import { cityForm, cityModel, constants, modalFooter, transporterForm, transporterModel } from "./index.js"

export const submitHandler = async ({ data: { name }, id }) => {

  const isFromCity = id === constants.CITY_ID
  const newModel = isFromCity ? cityModel : transporterModel
  const newForm = isFromCity ? cityForm : transporterForm
  const exists = await newModel.exists({
    continue: {
      name
    }
  })

  if (exists) {
    newForm.toggleInputError({
      id: "name"
    },
      {
        setError: true,
        customMessage: value => `El valor: ${value} ya existe`,
        useForbiddenValue: true
      }
    )
  }

  const isInserted = await newModel.insert({
    name: {
      Str: name
    }
  })

  let message = "Creacion correcta"
  let isSuccess = true

  if (!isInserted) {
    message = "Hubo un error insertando el dato :("
    isSuccess = false
  }

  modalFooter.active({
    isSuccess,
    message,
    useErrorTitle: !isSuccess,
    useSuccessTitle: isSuccess,
    duration: 3000
  })
}