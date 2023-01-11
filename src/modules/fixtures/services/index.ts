import config from 'config'
import * as DAL from '../dal'

import {
  buildFixtureFilterQuery,
  formatIndividualFixture,
  formatFixtures,
} from './helpers'

import {
  FixtureAttributes,
  EditFixtureInput,
  QueryInput,
  FixtureFilter,
} from '../../../types'

import {
  BadRequestError,
  buildDate,
  generatePublicId,
  NotFoundError,
} from '../../../common'

const baseUrl = config.get<string>('baseUrl')

export const addFixture = async (
  input: Omit<FixtureAttributes, 'publicId' | 'link' | 'date'> & {
    date: string
  },
) => {
  const publicId = await generatePublicId()
  const link = `${baseUrl}/api/fixtures/${publicId}`
  const date = buildDate(input.date)
  return DAL.addFixture({ ...input, publicId, link, date })
}

export const removeFixture = async (publicId: string) => {
  const result = await DAL.removeFixture(publicId)
  if (!result) {
    throw new NotFoundError('fixture does not exist')
  }
  return result
}

export const editFixture = async (
  publicId: string,
  input: Omit<EditFixtureInput, 'date'> & { date?: string },
) => {
  const existingFixture = await DAL.getFixtureByPublicId(publicId)
  if (!existingFixture) {
    throw new NotFoundError('fixture does not exist')
  }

  if (
    !input.awayTeam &&
    existingFixture?.awayTeam?.toString() === input.homeTeam
  ) {
    throw new BadRequestError('home and away team cannot be the same')
  }

  if (
    !input.homeTeam &&
    existingFixture?.homeTeam?.toString() === input.awayTeam
  ) {
    throw new BadRequestError('home and away team cannot be the same')
  }

  const date = input.date ? { date: buildDate(input.date) } : {}
  const result = await DAL.editFixture(publicId, {
    ...input,
    ...date,
  } as EditFixtureInput)

  if (!result) {
    throw new NotFoundError('fixture does not exist')
  }
  return result
}

export const getFixtures = async ({
  page = 1,
  limit = 10,
  sort = 'desc',
  ...filter
}: Omit<QueryInput, 'search'> & FixtureFilter) => {
  const filterQuery = buildFixtureFilterQuery(filter)
  const count = await DAL.getFixtureCount(filterQuery)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const fixtures = await DAL.getFixtures({
    page: +page,
    limit: +limit,
    sort,
    filter: filterQuery,
  })

  const formattedFixtures = formatFixtures(fixtures)

  return {
    fixtures: formattedFixtures,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}

export const getFixtureByPublicId = async (publicId: string) => {
  const result = await DAL.getFixtureByPublicId(publicId, true)
  if (!result) {
    throw new NotFoundError('fixture does not exist')
  }

  const formattedFixture = formatIndividualFixture(result)
  return formattedFixture
}
