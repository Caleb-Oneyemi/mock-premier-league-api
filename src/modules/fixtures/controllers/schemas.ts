import { z } from 'zod'
import {
  FixtureTypes,
  genericQuerySchema,
  isValidDate,
  isValidFormat,
} from '../../../common'

const { pending, completed } = FixtureTypes

export const createFixtureSchema = z
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

export type CreateFixtureSchemaType = z.infer<typeof createFixtureSchema>

export const editFixtureSchema = createFixtureSchema.partial().refine(
  (input) => {
    if (Object.keys(input).length === 0) return false
    return true
  },
  {
    message: 'update must contain at least one property',
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
      .refine(isValidDate, 'date must be a valid date in the future'),
    dateBefore: z
      .string()
      .trim()
      .refine(isValidFormat, 'date must be in the format DD/MM/YYYY')
      .refine(isValidDate, 'date must be a valid date in the future'),
  })
  .strict()
  .partial()

export type GetFixturesSchemaType = z.infer<typeof getFixturesSchema>
