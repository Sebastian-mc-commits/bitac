
// const commonInputFields = [
//   {
//     key: "locationDescription",
//     placeholder: "Direccion y detalles",
//     spanTitle: "Direccion",
//     type: "text",
//     name: "locationDescription",
//     oninput: (target) => {
//       const {value} = target
//       target.value = value ? value.replace(/\s+/g, " ") : ""
//     },
//     onblur: (target) => {
//       const {value} = target
//       target.value = value.trim()
//     }
//   },
// 
//   {
//     key: "nit",
//     placeholder: "Valor unico",
//     spanTitle: "Nit / cedula",
//     type: "text",
//     name: "nit",
//     oninput: (target) => {
//       const {value} = target
//       target.value = value ? value.replace(/\s+/g, "") : ""
//     }
//   },
// 
//   {
//     key: "phoneNumber",
//     placeholder: "3023492663",
//     name: "phoneNumber",
//     spanTitle: "Telefono",
//     type: "text",
//     oninput: (target) => {
//       const {value} = target
//       target.value = value ? value.
//       replace(/[^0-9\s]/g, "").
//       replace(/\s+/g, " | ").
//       replace(/\|\s$/g, "") : ""
// 
//       const values = value.split(/\s+\|\s+|\s/)
//       if (values?.some(s => s.length > 10) || (value.length > 10 && !value?.includes(" | "))) {
//         target.value = values.map(s => s.length > 10 ? s.substring(0, 9) : s).join(" | ")
//       }
//     },
//     onblur: (target) => {
//       const {value} = target
//       target.value = value.trim()
//     }
//   },
// 
//   {
//     key: "name",
//     placeholder: "S.A.S",
//     spanTitle: "Empresa",
//     name: "name",
//     type: "text",
//     oninput: (target) => {
//       const {value} = target
//       target.value = value && (value.toUpperCase()[0] + value.slice(1)).replace(/\s+/g, " ");
//     },
//     onblur: (target) => {
//       const {value} = target
//       target.value = value.trim()
//     }
//   }
// ];
// 
// export default commonInputFields;

export const senderInputValues = [
  {
    spanTitle: "NIT",
    labelFor: "nit",
    inputName: "nit",
    input: {
      defaultValue: "",
      placeholder: "111115555000",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.replace(/\s+/g, " ") : ""
    }
  },
  {
    spanTitle: "Name",
    labelFor: "name",
    inputName: "name",
    input: {
      defaultValue: "",
      placeholder: "Bitas S.A.S",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value && (value.toUpperCase()[0] + value.slice(1)).replace(/\s+/g, " ");
    },
  },
  {
    spanTitle: "Telefono",
    labelFor: "phoneNumber",
    inputName: "phoneNumber",
    input: {
      defaultValue: "",
      placeholder: "3023492663",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.
        replace(/[^0-9\s]/g, "").
        replace(/\s+/g, " | ").
        replace(/\|\s$/g, "") : ""

      const values = value.split(/\s+\|\s+|\s/)
      if (values?.some(s => s.length > 10) || (value.length > 10 && !value?.includes(" | "))) {
        target.value = values.map(s => s.length > 10 ? s.substring(0, 9) : s).join(" | ")
      }
    },
  },
  {
    spanTitle: "Direccion",
    labelFor: "locationDescription",
    inputName: "locationDescription",
    input: {
      defaultValue: "",
      placeholder: "###",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.replace(/\s+/g, " ") : ""
    }
  }
]

export const destinationValues = [
  {
    spanTitle: "NIT",
    labelFor: "nit",
    inputName: "nit",
    input: {
      defaultValue: "",
      placeholder: "111115555000",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.replace(/\s+/g, " ") : ""
    }
  },
  {
    spanTitle: "Name",
    labelFor: "name",
    inputName: "name",
    input: {
      defaultValue: "",
      placeholder: "Bitas S.A.S",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value && (value.toUpperCase()[0] + value.slice(1)).replace(/\s+/g, " ");
    },
  },
  {
    spanTitle: "Telefono",
    labelFor: "phoneNumber",
    inputName: "phoneNumber",
    input: {
      defaultValue: "",
      placeholder: "3023492663",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.
        replace(/[^0-9\s]/g, "").
        replace(/\s+/g, " | ").
        replace(/\|\s$/g, "") : ""

      const values = value.split(/\s+\|\s+|\s/)
      if (values?.some(s => s.length > 10) || (value.length > 10 && !value?.includes(" | "))) {
        target.value = values.map(s => s.length > 10 ? s.substring(0, 9) : s).join(" | ")
      }
    },
  },
  {
    spanTitle: "Direccion",
    labelFor: "locationDescription",
    inputName: "locationDescription",
    input: {
      defaultValue: "",
      placeholder: "###",
      type: "text"
    },
    oninput: (target) => {
      const { value } = target
      target.value = value ? value.replace(/\s+/g, " ") : ""
    }
  }
]