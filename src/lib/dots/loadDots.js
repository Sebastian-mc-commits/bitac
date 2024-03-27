
export default (element, useSetter) => {

    let dots = 0
    let ms = 0

    const interval = setInterval(async () => {

        if (dots >= 3) {
            await new Promise(rs => {
                setTimeout(() => {
                    element.textContent = element.textContent.slice(0, -3)
                    dots = 0
                    ms = 300
                    rs()
                }, ms)
            })
        }

        await new Promise(rs => {
            setTimeout(() => {
                element.textContent += "."
                dots++
                rs()
            }, ms)
        })
    }, 500)

    return async () => {
        clearInterval(interval)
        element.textContent = element.textContent.slice(0, dots * -1)

        if (useSetter) {
            element.style.transition = "filter 0.3s"
            element.classList.add("blur-1rem")

            await new Promise(rs => {

                setTimeout(() => {
                    element.classList.remove("blur-1rem")
                    rs()
                }, 400)
            })
        }

        return element
    }
}