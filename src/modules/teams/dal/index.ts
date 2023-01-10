import { Team } from '../models'
import {
  TeamAttributes,
  TeamFilter,
  EditTeamInput,
  QueryInput,
} from '../../../types'

export const addTeam = async (input: TeamAttributes) => {
  return Team.build(input)
}

export const removeTeam = async (publicId: string) => {
  return Team.findOneAndDelete({ publicId })
}

export const editTeam = async (publicId: string, input: EditTeamInput) => {
  return Team.findOneAndUpdate({ publicId }, input, { new: true }).exec()
}

export const getTeams = async ({
  page,
  limit,
  sort,
  filter,
}: Required<Omit<QueryInput, 'search'>> & { filter: TeamFilter }) => {
  return Team.find(filter)
    .sort({ createdAt: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec()
}

export const getTeamCount = async (filter: TeamFilter) => {
  return Team.countDocuments(filter).exec()
}
