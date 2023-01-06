import { Schema, model } from 'mongoose'

import { UserAttributes, UserDoc, UserModel } from '../types'
import { UserTypes } from '../../../common'

const userSchema = new Schema<UserAttributes>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
    },
    type: {
      type: String,
      required: true,
      enum: [...Object.keys(UserTypes)],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
      },
    },
  },
)

userSchema.statics.build = (input: UserAttributes) => {
  return new User(input).save()
}

export const User = model<UserDoc, UserModel>('User', userSchema)
