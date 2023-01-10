import config from 'config'
import { buildFixtureFilterQuery, formatFixtures } from './helpers'
import * as DAL from '../dal'

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
  input: Omit<EditFixtureInput, 'date'> & { date?: string | Date },
) => {
  if (input.date) {
    input.date = buildDate(input.date)
  }

  const result = await DAL.editFixture(publicId, input as EditFixtureInput)
  if (!result) {
    throw new NotFoundError('fixture does not exist')
  }
  return result
}

export const getFixtures = async ({
  page = 1,
  limit = 10,
  sort = 'desc',
  search,
  ...filter
}: QueryInput & FixtureFilter) => {
  const filterQuery = buildFixtureFilterQuery(search, filter)
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
