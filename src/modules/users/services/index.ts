import { BaseUser } from '../types'
import * as DAL from '../dal'
import {
  hashPassword,
  isPasswordValid,
  generatePublicId,
  ConflictError,
  AuthenticationError,
  generateToken,
  storeSession,
} from '../../../common'

type UserInput = Omit<BaseUser, 'publicId'>

export const handleCreateUser = async (username: string, password: string) => {
  const existingUser = await DAL.getUserByUsername(username)
  if (existingUser) {
    throw new ConflictError('username already in use')
  }

  const [hash, publicId] = await Promise.all([
    hashPassword(password),
    generatePublicId(),
  ])

  return {
    publicId,
    username: username,
    password: hash,
  }
}

export const createAppUser = async ({ username, password }: UserInput) => {
  const data = await handleCreateUser(username, password)
  return DAL.createAppUser(data)
}

export const createAdminUser = async ({ username, password }: UserInput) => {
  const data = await handleCreateUser(username, password)
  return DAL.createAdminUser(data)
}

export const login = async ({ username, password }: UserInput) => {
  const existingUser = await DAL.getUserByUsername(username)
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
