import { z } from 'zod'
import { genericQuerySchema } from '../../../common'

export const isValidName = (input: string) => {
  const res = input.match(/^[a-z_]+$/i)
  if (res == null) return false
  let includesOnlyUnderScore = true

  for (const char of input) {
    if (char !== '_') {
      includesOnlyUnderScore = false
      break
    }
  }

  return !includesOnlyUnderScore
}

export const createTeamSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .refine(
        isValidName,
        'name must either only alphabets or alphabets with underscore',
      ),
    foundingYear: z.number().min(1992).max(new Date().getFullYear()),
    stadium: z.string().trim().min(2).max(50),
    owner: z.string().trim().min(2).max(50),
    coach: z.string().trim().min(2).max(50).optional(),
    playerCount: z.number().positive().optional(),
    matches: z.number().positive().optional(),
    goals: z.number().positive().optional(),
  })
  .strict()

export type CreateTeamSchemaType = z.infer<typeof createTeamSchema>

export const editTeamSchema = createTeamSchema.partial().refine(
  (input) => {
    if (Object.keys(input).length === 0) return false
    return true
  },
  {
    message: 'update must contain at least one property',
  },
)

export type EditTeamSchemaType = z.infer<typeof editTeamSchema>

export const getTeamsSchema = genericQuerySchema
  .extend({
    minPlayerCount: z.coerce.number().positive(),
    maxPlayerCount: z.coerce.number().positive(),
    minMatches: z.coerce.number().positive(),
    maxMatches: z.coerce.number().positive(),
    minGoals: z.coerce.number().positive(),
    maxGoals: z.coerce.number().positive(),
  })
  .strict()
  .partial()

export type GetTeamsSchemaType = z.infer<typeof getTeamsSchema>
