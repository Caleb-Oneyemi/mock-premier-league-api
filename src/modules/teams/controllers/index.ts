import {
  createTeamSchema,
  CreateTeamSchemaType,
  editTeamSchema,
  EditTeamSchemaType,
  getTeamsSchema,
  GetTeamsSchemaType,
} from './schemas'

import * as TeamService from '../services'
import { ControllerInput } from '../../../types'

export const addTeam = async ({
  input,
}: ControllerInput<CreateTeamSchemaType>) => {
  await createTeamSchema.parseAsync(input)
  return TeamService.addTeam(input)
}

export const removeTeam = async ({
  params,
}: ControllerInput<{}, { publicId: string }>) => {
  return TeamService.removeTeam(params.publicId)
}

export const editTeam = async ({
  input,
  params,
}: ControllerInput<EditTeamSchemaType, { publicId: string }>) => {
  await editTeamSchema.parseAsync(input)
  return TeamService.editTeam(params.publicId, input)
}

export const getTeams = async ({
  query,
}: ControllerInput<{}, {}, GetTeamsSchemaType>) => {
  await getTeamsSchema.parseAsync(query)
  return TeamService.getTeams(query)
}
