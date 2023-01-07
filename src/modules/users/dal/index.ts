import { UserTypes } from '../../../common'
import { User } from '../models'
import { UserAttributes } from '../types'

type BaseUser = Omit<UserAttributes, 'role'>

export const createAdminUser = async (input: BaseUser) => {
  return User.build({ ...input, role: UserTypes.ADMIN_USER })
}

export const createRegularUser = async (input: BaseUser) => {
  return User.build({ ...input, role: UserTypes.APP_USER })
}

export const getUserByUsername = async (username: string) => {
  return User.findOne({ username })
}
