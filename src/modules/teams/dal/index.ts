import { Team } from '../models'
import { TeamAttributes, TeamFilter, EditTeamInput } from '../types'
import { QueryInput } from '../../../common'

export const addTeam = async (input: TeamAttributes) => {
  return Team.build(input)
}

export const removeTeam = async (name: string) => {
  return Team.findOneAndDelete({ name })
}

export const editTeam = async (name: string, input: EditTeamInput) => {
  return Team.findOneAndUpdate({ name }, input)
}

export const getTeams = async ({
  page,
  limit,
  sort,
  filter,
}: Required<Omit<QueryInput, 'search'>> & { filter: TeamFilter }) => {
  return Team.find(filter)
    .sort({ createdAt: sort })
    .limit(+limit)
    .skip((+page - 1) * +limit)
    .exec()
}

export const getTeamCount = async (filter: TeamFilter) => {
  return Team.countDocuments(filter)
}
