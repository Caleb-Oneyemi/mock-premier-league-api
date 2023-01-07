import { BaseUser } from '../types'
import { createRegularUser, getUserByUsername } from '../dal'
import { hashPassword, generatePublicId, ConflictError } from '../../../common'

export const createUser = async ({
  username,
  password,
}: Omit<BaseUser, 'publicId'>) => {
  const existingUser = await getUserByUsername(username)
  if (existingUser) {
    throw new ConflictError('username already in use')
  }

  const [hash, publicId] = await Promise.all([
    hashPassword(password),
    generatePublicId(),
  ])

  const data = {
    publicId,
    username: username,
    password: hash,
  }

  const result = await createRegularUser(data)
  return result
}
