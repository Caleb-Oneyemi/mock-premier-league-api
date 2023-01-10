import { User } from '../models'
import { UserTypes } from '../../../common'
import { BaseUser } from '../../../types'

export const createAdminUser = async (input: BaseUser) => {
  return User.build({ ...input, role: UserTypes.ADMIN_USER })
}

export const createAppUser = async (input: BaseUser) => {
  return User.build({ ...input, role: UserTypes.APP_USER })
}

export const getUserByUsername = async (username: string) => {
  return User.findOne({ username })
}
