import { nanoid } from 'nanoid/async'

export const generatePublicId = async (size?: number) => {
  if (size == undefined) return nanoid()
  return nanoid(size)
}
