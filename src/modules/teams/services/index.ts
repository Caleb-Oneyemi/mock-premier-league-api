import { buildTeamFilterQuery } from './helpers'
import * as DAL from '../dal'

import {
  TeamAttributes,
  EditTeamInput,
  NumberQuery,
  QueryInput,
} from '../../../types'

import {
  BadRequestError,
  generatePublicId,
  NotFoundError,
} from '../../../common'

export const addTeam = async (input: Omit<TeamAttributes, 'publicId'>) => {
  const publicId = await generatePublicId()
  return DAL.addTeam({ ...input, publicId })
}

export const removeTeam = async (publicId: string) => {
  const result = await DAL.removeTeam(publicId)
  if (!result) {
    throw new NotFoundError('team does not exist')
  }
  return result
}

export const editTeam = async (publicId: string, input: EditTeamInput) => {
  const result = await DAL.editTeam(publicId, input)
  if (!result) {
    throw new NotFoundError('team does not exist')
  }
  return result
}

export const getTeams = async ({
  page = 1,
  limit = 10,
  sort = 'desc',
  search,
  ...numberQueries
}: QueryInput & NumberQuery) => {
  const query = buildTeamFilterQuery(search, numberQueries)
  const count = await DAL.getTeamCount(query)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const teams = await DAL.getTeams({
    page: +page,
    limit: +limit,
    sort,
    filter: query,
  })

  return {
    teams,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}
