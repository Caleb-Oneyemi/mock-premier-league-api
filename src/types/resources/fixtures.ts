import { Document, Model } from 'mongoose'
import { TeamAttributes } from './teams'
import { FixtureTypes } from '../../common'

export interface FixtureAttributes {
  publicId: string
  link: string
  homeTeam: string | Partial<TeamAttributes>
  awayTeam: string | Partial<TeamAttributes>
  status: keyof typeof FixtureTypes
  date: Date
  stadium?: string
}

export interface FixtureDoc extends FixtureAttributes, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface FixtureModel extends Model<FixtureDoc> {
  build(input: FixtureAttributes): FixtureDoc
}

export type EditFixtureInput = Partial<
  Omit<FixtureAttributes, 'publicId' | 'link' | 'stadium'>
>

export type FixtureFilter = {
  status?: keyof typeof FixtureTypes
  dateBefore?: string
  dateAfter?: string
}

export interface FixtureFilterQuery {
  stadium?: { $regex: string; $options: 'i' }
  status?: keyof typeof FixtureTypes
  date?: {
    $lte?: Date
    $gte?: Date
  }
}
