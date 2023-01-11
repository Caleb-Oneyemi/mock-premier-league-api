import config from 'config'
import { buildDate } from '../../../common'
import {
  FixtureAttributes,
  FixtureFilter,
  FixtureFilterQuery,
} from '../../../types'

const baseUrl = config.get<string>('baseUrl')

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
      query.date = { $lt: date }
    } else {
      query.date.$lt = date
    }
  }

  if (dateAfter) {
    const date = buildDate(dateAfter)

    if (!query.date) {
      query.date = { $gt: date }
    } else {
      query.date.$gt = date
    }
  }

  return query
}

export const formatIndividualFixture = (fixture: FixtureAttributes) => {
  if (fixture.homeTeam && typeof fixture.homeTeam !== 'string') {
    fixture.stadium = fixture.homeTeam?.stadium
    fixture.homeTeam.stadium = undefined
  }

  fixture.link = `${baseUrl}/${fixture.link}`
  return fixture
}

export const formatFixtures = (fixtures: FixtureAttributes[]) => {
  return fixtures.map((fixture) => {
    return formatIndividualFixture(fixture)
  })
}
