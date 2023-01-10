import { Document, Model } from 'mongoose'
import { FixtureTypes } from '../../common/constants'

export interface FixtureAttributes {
  publicId: string
  link: string
  homeTeam: string
  awayTeam: string
  stadium: string
  status: keyof typeof FixtureTypes
  date: Date
}

export interface FixtureDoc extends FixtureAttributes, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface FixtureModel extends Model<FixtureDoc> {
  build(input: FixtureAttributes): FixtureDoc
}
