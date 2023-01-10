import { Document, Model } from 'mongoose'
import { UserTypes } from '../../common'

export interface UserAttributes {
  publicId: string
  username: string
  password: string
  role: keyof typeof UserTypes
}

export type BaseUser = Omit<UserAttributes, 'role'>

export interface UserDoc extends UserAttributes, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserModel extends Model<UserDoc> {
  build(input: UserAttributes): UserDoc
}
