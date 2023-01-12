export const buildDate = (date: string) => {
  const [day, month, year] = date.split('/')
  const result = new Date(+year, +month - 1, +day)
  return result
}

export const isValidFormat = (date: string) => {
  if (date.length !== 10) return false

  const [day, month, year] = date.split('/')
  if (day.length !== 2 || month.length !== 2 || year.length !== 4) {
    return false
  }

  if (isNaN(+day) || isNaN(+month) || isNaN(+year)) {
    return false
  }

  return true
}

export const isValidDate = (date: string, isFuture = true) => {
  const [day, month] = date.split('/')
  if (+day < 1 || +day > 31) {
    return false
  }

  if (+month < 1 || +month > 12) {
    return false
  }

  if (isFuture && buildDate(date) < new Date()) {
    return false
  }

  return true
}
