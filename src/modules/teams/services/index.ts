import { buildTeamFilter } from './helpers'
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

export const removeTeam = async (name: string) => {
  const result = await DAL.removeTeam(name.toLowerCase())
  if (!result) {
    throw new NotFoundError('team does not exist')
  }
  return result
}

export const editTeam = async (name: string, input: EditTeamInput) => {
  const result = await DAL.editTeam(name.toLowerCase(), input)
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
  const filter = buildTeamFilter(search, numberQueries)
  const count = await DAL.getTeamCount(filter)
  const totalPages = Math.ceil(count / +limit) || 1

  if (+page > totalPages) {
    throw new BadRequestError('page number must be below total pages')
  }

  const teams = await DAL.getTeams({ page: +page, limit: +limit, sort, filter })

  return {
    teams,
    limit: +limit,
    currentPage: +page,
    totalPages,
  }
}
