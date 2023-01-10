import { Fixture } from '../models'
import {
  FixtureAttributes,
  FixtureFilter,
  EditFixtureInput,
  QueryInput,
} from '../../../types'

export const addFixture = async (input: FixtureAttributes) => {
  return Fixture.build(input)
}

export const removeFixture = async (publicId: string) => {
  return Fixture.findOneAndDelete({ publicId })
}

export const editFixture = async (
  publicId: string,
  input: EditFixtureInput,
) => {
  return Fixture.findOneAndUpdate({ publicId }, input, { new: true }).exec()
}

export const getFixtures = async ({
  page,
  limit,
  sort,
  filter,
}: Required<Omit<QueryInput, 'search'>> & { filter: FixtureFilter }) => {
  return Fixture.find(filter)
    .sort({ date: sort })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate({
      path: 'homeTeam',
      select: 'name stadium',
    })
    .populate({
      path: 'awayTeam',
      select: 'name',
    })
    .exec()
}

export const getFixtureCount = async (filter: FixtureFilter) => {
  return Fixture.countDocuments(filter).exec()
}

export const getFixtureByPublicId = async (
  publicId: string,
  populate?: boolean,
) => {
  if (!populate) {
    return Fixture.findOne({ publicId })
  }

  return Fixture.findOne({ publicId })
    .populate({
      path: 'homeTeam',
      select: 'name stadium',
    })
    .populate({
      path: 'awayTeam',
      select: 'name',
    })
    .exec()
}
