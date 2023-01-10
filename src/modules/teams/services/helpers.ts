import { NumberFilter, NumberQuery, TeamFilterQuery } from '../../../types'

export const buildTeamFilterQuery = (
  search: string | undefined,
  numberQueries: NumberQuery,
) => {
  const query: TeamFilterQuery = {}

  if (search) {
    const searchQuery = { $regex: search, $options: 'i' } as const
    Object.assign<TeamFilterQuery, Pick<TeamFilterQuery, '$or'>>(query, {
      $or: [
        { coach: searchQuery },
        { name: searchQuery },
        { owner: searchQuery },
        { stadium: searchQuery },
      ],
    })
  }

  type DbField = keyof NumberFilter

  Object.keys(numberQueries).forEach((key) => {
    // numbers coming in from req.query are in strings so convert
    const value = Number(numberQueries[key as keyof NumberQuery])

    if (key.includes('min')) {
      const [, field] = key.split('min')
      const dbField = (field[0].toLowerCase() + field.slice(1)) as DbField

      if (!query[dbField]) {
        query[dbField] = { $gte: value }
      } else {
        query[dbField]!.$gte = value
      }
    }

    if (key.includes('max')) {
      const [, field] = key.split('max')
      const dbField = (field[0].toLowerCase() + field.slice(1)) as DbField

      if (!query[dbField]) {
        query[dbField] = { $lte: value }
      } else {
        query[dbField]!.$lte = value
      }
    }
  })

  return query
}
