import {
  FixtureAttributes,
  FixtureFilter,
  FixtureFilterQuery,
} from '../../../types'

export const buildFixtureFilterQuery = (
  search: string | undefined,
  { status, dateAfter, dateBefore }: FixtureFilter,
) => {
  const query: FixtureFilterQuery = {}
  if (search) {
    Object.assign<FixtureFilterQuery, Pick<FixtureFilterQuery, 'stadium'>>(
      query,
      {
        stadium: { $regex: search, $options: 'i' },
      },
    )
  }

  if (status) {
    Object.assign<FixtureFilterQuery, Pick<FixtureFilterQuery, 'status'>>(
      query,
      {
        status,
      },
    )
  }

  if (dateBefore) {
    const [day, month, year] = dateBefore.split('/')
    const date = new Date(+year, +month - 1, +day)

    Object.assign<FixtureFilterQuery, Pick<FixtureFilterQuery, 'date'>>(query, {
      date: { $lte: date },
    })
  }

  if (dateAfter) {
    const [day, month, year] = dateAfter.split('/')
    const date = new Date(+year, +month - 1, +day)

    Object.assign<FixtureFilterQuery, Pick<FixtureFilterQuery, 'date'>>(query, {
      date: { $gte: date },
    })
  }

  return query
}

export const formatFixtures = (fixtures: FixtureAttributes[]) => {
  return fixtures.map((fixture) => {
    if (typeof fixture.homeTeam !== 'string') {
      fixture.stadium = fixture.homeTeam?.stadium
      delete fixture.homeTeam.stadium
    }

    return fixture
  })
}
