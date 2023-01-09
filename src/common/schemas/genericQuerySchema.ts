import { z } from 'zod'

export const genericQuerySchema = z
  .object({
    page: z.coerce.number().positive(),
    limit: z.coerce.number().positive(),
    sort: z.enum(['asc', 'desc']),
    search: z.string().trim().min(1).max(50),
  })
  .strict()
  .partial()
