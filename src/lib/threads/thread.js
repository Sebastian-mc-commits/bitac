export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const letters_numbers = "QWERTYUIOPASDFGHJKLÑZXCVBNM1234567890"

const setOpacity = (element) => {
    element.style.opacity = "0"
    setTimeout(() => {
        element.style.opacity = "1"
    }, 500)
}

export const iterations = (word, element, onIteration, iterationEnd) => {

    const callbacks = []
    element.style.transition = "opacity 0.4s"
    let isCancelled = false

    for (const l in word) {
        const symbol = letters_numbers[l]
        let delayValue = 100
        if (l % 2 === 0) {
            delayValue = 200
        }
        else if (l % 5 === 0) {
            delayValue = 300
        }
        else if (l % 7 === 0) {
            delayValue = 400
        }

        callbacks.push(
            async () => {
                for (let i = 0; i < letters_numbers.length - 1; i++) {
                    if (isCancelled) return
                    await delay(delayValue);
                    onIteration(word, element, l, i, symbol, i === letters_numbers.length - 2)
                }
            }
        )
    }

    Promise.all(
        callbacks.map(c => c())
    ).then(() => isCancelled || iterationEnd(() => setOpacity(element), word, element))

    return (whenCancelled) => {
        isCancelled = true
        whenCancelled(() => setOpacity(element))
    }
}

export default (word, element, iterationEnd) => iterations(
    word,
    element,
    (word, element, letterPos, letterNumberPos, _symbol, isFinal) => {

        const currentLetterNumber = letters_numbers[letterNumberPos]

        const letter = isFinal ? word[letterPos] : currentLetterNumber

        const slicedWord = element.textContent.split("")
        slicedWord[letterPos] = letter

        element.textContent = slicedWord.join("")

        if (isFinal) {
            setOpacity(element)
        }

    },

    iterationEnd
)