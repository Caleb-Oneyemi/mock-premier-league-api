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
}: ControllerInput<{}, { name: string }>) => {
  return TeamService.removeTeam(params.name)
}

export const editTeam = async ({
  input,
  params,
}: ControllerInput<EditTeamSchemaType, { name: string }>) => {
  await editTeamSchema.parseAsync(input)
  return TeamService.editTeam(params.name, input)
}

export const getTeams = async ({
  query,
}: ControllerInput<{}, {}, GetTeamsSchemaType>) => {
  await getTeamsSchema.parseAsync(query)
  return TeamService.getTeams(query)
}
