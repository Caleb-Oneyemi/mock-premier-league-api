import { z } from 'zod'

export const userSchema = z
  .object({
    username: z.string().trim().min(2).max(50),
    password: z.string().trim().min(8).max(50),
  })
  .strict()

export type User = z.infer<typeof userSchema>
