import { UserTypes } from '../common'

export interface RequestUser {
  publicId: string
  username: string
  role: keyof typeof UserTypes
}
