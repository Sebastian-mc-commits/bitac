
export const difference = ({reduce = false, or = false}, ...values) => (reduce ? values.slice(1) : values)[or ? "some" : "every"]((val, index) => {
  if (reduce) {
    return values[0] !== val
  }

  return values[index + 1] ? val !== values[index + 1] : !or
})
export const equality = ({reduce = false, or = false}, ...values) => (reduce ? values.slice(1) : values)[or ? "some" : "every"]((val, index) => {
  if (reduce) {
    return values[0] === val
  }

  return values[index + 1] ? val === values[index + 1] : !or
})

export const getId = (id) => isNaN(id) ? id : parseInt(id)

export const validateIds = (...ids) => ids.every(id => getId(id) === getId(ids[0]))

export const lowerCase = (string = "") => string.split("_").map((str, index) => 
index === 0 ? str.toLowerCase() : str[0].toUpperCase() + str.slice(1).toLowerCase()).join("")