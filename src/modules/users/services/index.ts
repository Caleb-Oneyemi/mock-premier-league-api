import { BaseUser } from '../types'
import { createRegularUser, getUserByUsername } from '../dal'
import {
  hashPassword,
  isPasswordValid,
  generatePublicId,
  ConflictError,
  AuthenticationError,
  generateToken,
  storeSession,
} from '../../../common'

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

export const loginUser = async ({
  username,
  password,
}: Omit<BaseUser, 'publicId'>) => {
  const existingUser = await getUserByUsername(username)
  if (!existingUser) {
    throw new AuthenticationError('invalid credentials')
  }

  const isValid = await isPasswordValid(password, existingUser.password)
  if (!isValid) {
    throw new AuthenticationError('invalid credentials')
  }

  const token = generateToken(existingUser.publicId)
  await storeSession({
    username,
    role: existingUser.role,
    id: existingUser.publicId,
  })

  return { user: existingUser, token }
}
