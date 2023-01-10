import { buildDate } from '../../../common'
import {
  FixtureAttributes,
  FixtureFilter,
  FixtureFilterQuery,
} from '../../../types'

export const buildFixtureFilterQuery = ({
  status,
  dateAfter,
  dateBefore,
}: FixtureFilter) => {
  const query: FixtureFilterQuery = {}
  if (status) {
    query.status = status
  }

  if (dateBefore) {
    const date = buildDate(dateBefore)

    if (!query.date) {
      query.date = { $lte: date }
    } else {
      query.date.$lte = date
    }
  }

  if (dateAfter) {
    const date = buildDate(dateAfter)

    if (!query.date) {
      query.date = { $gte: date }
    } else {
      query.date.$gte = date
    }
  }

  return query
}

export const formatFixtures = (fixtures: FixtureAttributes[]) => {
  return fixtures.map((fixture) => {
    if (fixture.homeTeam && typeof fixture.homeTeam !== 'string') {
      fixture.stadium = fixture.homeTeam?.stadium
      fixture.homeTeam.stadium = undefined
    }

    return fixture
  })
}

export const formatIndividualFixture = (fixture: FixtureAttributes) => {
  if (fixture.homeTeam && typeof fixture.homeTeam !== 'string') {
    fixture.stadium = fixture.homeTeam?.stadium
    fixture.homeTeam.stadium = undefined
  }

  return fixture
}
