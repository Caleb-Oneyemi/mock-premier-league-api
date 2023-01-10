import {
  createFixtureSchema,
  CreateFixtureSchemaType,
  editFixtureSchema,
  EditFixtureSchemaType,
  getFixturesSchema,
  GetFixturesSchemaType,
} from './schemas'

import * as FixtureService from '../services'
import { ControllerInput } from '../../../types'

export const addFixture = async ({
  input,
}: ControllerInput<CreateFixtureSchemaType>) => {
  await createFixtureSchema.parseAsync(input)
  return FixtureService.addFixture(input)
}

export const removeFixture = async ({
  params,
}: ControllerInput<{}, { publicId: string }>) => {
  return FixtureService.removeFixture(params.publicId)
}

export const editFixture = async ({
  input,
  params,
}: ControllerInput<EditFixtureSchemaType, { publicId: string }>) => {
  await editFixtureSchema.parseAsync(input)
  return FixtureService.editFixture(params.publicId, input)
}

export const getFixtures = async ({
  query,
}: ControllerInput<{}, {}, GetFixturesSchemaType>) => {
  await getFixturesSchema.parseAsync(query)
  return FixtureService.getFixtures(query)
}

export const getFixtureByPublicId = async ({
  params,
}: ControllerInput<{}, { publicId: string }>) => {
  return FixtureService.getFixtureByPublicId(params.publicId)
}
