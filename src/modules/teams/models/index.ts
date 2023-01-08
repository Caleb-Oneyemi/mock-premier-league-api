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
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
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
      default: 0,
    },
    matches: {
      type: Number,
      default: 0,
    },
    goals: {
      type: Number,
      default: 0,
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
