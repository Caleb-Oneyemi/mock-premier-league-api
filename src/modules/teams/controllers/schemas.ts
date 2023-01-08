import { z } from 'zod'
import { isAlphabet, isPositiveInteger } from '../../../common'

const isValidYear = (year: string) => {
  const res =
    isPositiveInteger(year) &&
    Number(year) > 1900 &&
    Number(year) < new Date().getFullYear() + 1

  return res
}

const validateString = (data: unknown) => {
  if (typeof data !== 'string') return false
  return isPositiveInteger(data)
}

export const createTeamSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .refine(isAlphabet, 'only alphabets allowed'),
    foundingYear: z
      .string()
      .trim()
      .length(4)
      .refine(isValidYear, 'must be between 1900 and current year'),
    stadium: z.string().trim().min(2).max(50),
    owner: z.string().trim().min(2).max(50),
    coach: z.string().trim().min(2).max(50).optional(),
    playerCount: z.number().optional(),
    matches: z.number().optional(),
    goals: z.number().optional(),
  })
  .strict()

export type CreateTeamSchemaType = z.infer<typeof createTeamSchema>

export const editTeamSchema = createTeamSchema.omit({ name: true }).partial()

export type EditTeamSchemaType = z.infer<typeof editTeamSchema>

export const getTeamsSchema = z
  .object({
    page: z.custom<string>(validateString),
    limit: z.custom<string>(validateString),
    sort: z.enum(['asc', 'desc']),
    search: z.string().trim().min(1).max(50),
    minPlayerCount: z.custom<string>(validateString),
    maxPlayerCount: z.custom<string>(validateString),
    minMatches: z.custom<string>(validateString),
    maxMatches: z.custom<string>(validateString),
    minGoals: z.custom<string>(validateString),
    maxGoals: z.custom<string>(validateString),
  })
  .strict()
  .partial()

export type GetTeamsSchemaType = z.infer<typeof getTeamsSchema>
