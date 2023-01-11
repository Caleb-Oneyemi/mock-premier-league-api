import { Schema, model } from 'mongoose'
import { FixtureTypes } from '../../../common'
import { FixtureAttributes, FixtureDoc, FixtureModel } from '../../../types'

const fixtureSchema = new Schema<FixtureAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
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
    stadium: {
      type: String,
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

fixtureSchema.index({ homeTeam: 1, awayTeam: 1 }, { unique: true })

fixtureSchema.statics.build = (input: FixtureAttributes) => {
  return new Fixture(input).save()
}

export const Fixture = model<FixtureDoc, FixtureModel>('Fixture', fixtureSchema)
