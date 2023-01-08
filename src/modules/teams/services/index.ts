import { buildTeamFilter } from './helpers'
import * as DAL from '../dal'
import { TeamAttributes, EditTeamInput, NumberQuery } from '../types'
import { BadRequestError, QueryInput } from '../../../common'

export const addTeam = async (input: TeamAttributes) => {
  return DAL.addTeam(input)
}

export const removeTeam = async (name: string) => {
  return DAL.removeTeam(name)
}

export const editTeam = async (name: string, input: EditTeamInput) => {
  return DAL.editTeam(name, input)
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
