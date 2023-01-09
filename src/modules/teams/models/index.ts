import { Schema, model } from 'mongoose'
import { TeamAttributes, TeamDoc, TeamModel } from '../types'

const teamSchema = new Schema<TeamAttributes>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    foundingYear: {
      type: Number,
      required: true,
    },
    stadium: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    coach: {
      type: String,
      trim: true,
      lowercase: true,
    },
    playerCount: {
      type: Number,
    },
    matches: {
      type: Number,
    },
    goals: {
      type: Number,
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

teamSchema.statics.build = (input: TeamAttributes) => {
  return new Team(input).save()
}

export const Team = model<TeamDoc, TeamModel>('Team', teamSchema)
