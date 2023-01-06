import { UserTypes } from '../../../common'
import { User } from '../models'
import { UserAttributes } from '../types'

type BaseUser = Omit<UserAttributes, 'type'>

export const createAdminUser = async (input: BaseUser) => {
  return User.build({ ...input, type: UserTypes.ADMIN_USER })
}

export const createRegularUser = async (input: BaseUser) => {
  return User.build({ ...input, type: UserTypes.APP_USER })
}

export const getUserByUsername = async (username: string) => {
  return User.findOne({ username })
}
