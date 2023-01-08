import { z } from 'zod'
import { isStrongPassword } from '../../../common'

const msg =
  'password must have one lowercase letter, one uppercase letter, one number and one symbol'

export const userSchema = z
  .object({
    username: z.string().trim().min(2).max(50),
    password: z.string().trim().min(8).max(50).refine(isStrongPassword, msg),
  })
  .strict()

export type UserSchemaType = z.infer<typeof userSchema>
