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
  generatePublicId,
  NotFoundError,
} from '../../../common'

export const addFixture = async (
  input: Omit<FixtureAttributes, 'publicId'>,
) => {
  const publicId = await generatePublicId()
  return DAL.addFixture({ ...input, publicId })
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
  input: EditFixtureInput,
) => {
  const result = await DAL.editFixture(publicId, input)
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
