import crypto from 'crypto'
import { promisify } from 'util'
import validator from 'validator'

const scrypt = promisify(crypto.scrypt)

export const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = (await scrypt(password, salt, 64)) as Buffer
  return salt + ':' + hash.toString('hex')
}

export const isPasswordValid = async (password: string, hash: string) => {
  const [salt, key] = hash.split(':')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer

  if (key === derivedKey.toString('hex')) {
    return true
  }
  return false
}

export const isStrongPassword = (data: string) => {
  if (validator.isStrongPassword(data)) return true
  return false
}
