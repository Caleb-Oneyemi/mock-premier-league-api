import { z } from 'zod'
import {
  FixtureTypes,
  genericQuerySchema,
  isValidDate,
  isValidFormat,
} from '../../../common'

const { pending, completed } = FixtureTypes

const baseFixtureSchema = z
  .object({
    homeTeam: z.string().trim(),
    awayTeam: z.string().trim(),
    status: z.enum([pending, completed]),
    date: z
      .string()
      .trim()
      .refine(isValidFormat, 'date must be in the format DD/MM/YYYY')
      .refine(isValidDate, 'date must be a valid date in the future'),
  })
  .strict()

export const createFixtureSchema = baseFixtureSchema.refine(
  ({ homeTeam, awayTeam }) => {
    if (homeTeam === awayTeam) return false
    return true
  },
  {
    message: 'home and away team cannot be the same',
  },
)

export type CreateFixtureSchemaType = z.infer<typeof createFixtureSchema>

export const editFixtureSchema = baseFixtureSchema
  .partial()
  .refine(
    (input) => {
      if (Object.keys(input).length === 0) return false
      return true
    },
    {
      message: 'update must contain at least one property',
    },
  )
  .refine(
    ({ homeTeam, awayTeam }) => {
      if (typeof homeTeam === 'string' && homeTeam === awayTeam) return false
      return true
    },
    {
      message: 'home and away team cannot be the same',
    },
  )

export type EditFixtureSchemaType = z.infer<typeof editFixtureSchema>

export const getFixturesSchema = genericQuerySchema
  .extend({
    status: z.enum([pending, completed]),
    dateAfter: z
      .string()
      .trim()
      .refine(isValidFormat, 'date must be in the format DD/MM/YYYY')
      .refine((date) => isValidDate(date, false), 'date must be a valid date'),
    dateBefore: z
      .string()
      .trim()
      .refine(isValidFormat, 'date must be in the format DD/MM/YYYY')
      .refine((date) => isValidDate(date, false), 'date must be a valid date'),
  })
  .strict()
  .partial()

export type GetFixturesSchemaType = z.infer<typeof getFixturesSchema>
