import { NumberQuery } from '../types'

export const buildTeamFilter = (
  search: string | undefined,
  numberQueries: NumberQuery,
) => {
  const filter: Record<string, any> = {}

  if (search) {
    const searchQuery = { $regex: search, $options: 'i' }
    Object.assign(filter, {
      $or: [
        { coach: searchQuery },
        { name: searchQuery },
        { owner: searchQuery },
        { stadium: searchQuery },
      ],
    })
  }

  Object.keys(numberQueries).forEach((key) => {
    // numbers coming in from req.query are in strings so convert
    const value = Number(numberQueries[key as keyof NumberQuery])

    if (key.includes('min')) {
      const [, field] = key.split('min')
      const dbField = field[0].toLowerCase() + field.slice(1)

      if (!filter[dbField]) {
        Object.assign(filter, {
          [dbField]: { $gte: value },
        })
      } else {
        filter[dbField].$gte = value
      }
    }

    if (key.includes('max')) {
      const [, field] = key.split('max')
      const dbField = field[0].toLowerCase() + field.slice(1)

      if (!filter[dbField]) {
        Object.assign(filter, {
          [dbField]: { $lte: value },
        })
      } else {
        filter[dbField].$lte = value
      }
    }
  })

  return filter
}
