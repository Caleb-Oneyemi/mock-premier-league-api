import { Schema, model } from 'mongoose'
import { FixtureTypes } from '../../../common'
import { FixtureAttributes, FixtureDoc, FixtureModel } from '../types'

const fixtureSchema = new Schema<FixtureAttributes>(
  {
    link: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    homeTeam: {
      type: String,
      required: true,
      trim: true,
    },
    awayTeam: {
      type: String,
      required: true,
      trim: true,
    },
    stadium: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: [...Object.keys(FixtureTypes)],
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  },
)

fixtureSchema.statics.build = (input: FixtureAttributes) => {
  return new Fixture(input).save()
}

export const Fixture = model<FixtureDoc, FixtureModel>('Fixture', fixtureSchema)
