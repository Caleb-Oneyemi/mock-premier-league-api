import { nanoid } from 'nanoid/async'

export const generatePublicId = async (size?: number) => {
  if (size == undefined) return nanoid()
  return nanoid(size)
}

export const isPositiveInteger = (input: string) => {
  if (!input) return false
  const num = Number(input)
  if (!Number.isInteger(num) || num < 1) return false
  return true
}
