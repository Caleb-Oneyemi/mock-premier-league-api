import { CreateUserInput, createUserSchema } from './schemas'
import * as UserService from '../services'
import { ControllerInput } from '../../../common'

export const createUser = async ({
  input,
}: ControllerInput<CreateUserInput>) => {
  await createUserSchema.parseAsync(input)
  return UserService.createUser(input)
}
