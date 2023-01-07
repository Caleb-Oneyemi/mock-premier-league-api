import { UserTypes } from '../constants'

export interface RequestUser {
  publicId: string
  username: string
  role: keyof typeof UserTypes
}
