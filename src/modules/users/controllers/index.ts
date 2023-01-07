import { User, userSchema } from './schemas'
import * as UserService from '../services'
import { ControllerInput } from '../../../common'

export const createUser = async ({ input }: ControllerInput<User>) => {
  await userSchema.parseAsync(input)
  return UserService.createUser(input)
}

export const loginUser = async ({ input }: ControllerInput<User>) => {
  await userSchema.parseAsync(input)
  return UserService.loginUser(input)
}
