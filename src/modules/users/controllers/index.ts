import { userSchema, UserSchemaType } from './schemas'
import * as UserService from '../services'
import { ControllerInput } from '../../../common'

export const createAppUser = async ({
  input,
}: ControllerInput<UserSchemaType>) => {
  await userSchema.parseAsync(input)
  return UserService.createAppUser(input)
}

export const login = async ({ input }: ControllerInput<UserSchemaType>) => {
  await userSchema.parseAsync(input)
  return UserService.login(input)
}

export const createAdminUser = async ({
  input,
}: ControllerInput<UserSchemaType>) => {
  await userSchema.parseAsync(input)
  return UserService.createAdminUser(input)
}
