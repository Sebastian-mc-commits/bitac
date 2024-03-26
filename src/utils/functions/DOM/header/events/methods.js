
export default ({ payload: method }) => ({
  delete_all: async () => {
    const { message, confirm } = window.__TAURI__.dialog
    const { event } = window.__TAURI__

    const data = await fetch(import.meta.url.replace("js", "html"))

    let newWindow = window.open("about:blank", "", "width=600,height=500");
    if (!newWindow) {
      await message("Hubo un error eliminando los datos")
      return
    }

    const HTML = await data.text()

    newWindow.document.write(HTML);
    newWindow.opener = {
      whenSubmit: async ({ key }) => {
        newWindow.close()
        const result = await confirm("¿Seguro que deseas proceder?", "Eliminar todo")

        if (result) {
          await event.emit("methods", {
            event_type: "delete_all",
            event_data: {
              Str: key
            }
          })
          console.log("on delete ")
        }
      }
    }
  }
})?.[method.method]()
