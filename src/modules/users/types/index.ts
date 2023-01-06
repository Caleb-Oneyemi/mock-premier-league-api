import { Document, Model } from 'mongoose'
import { UserTypes } from '../../../common'

export interface UserAttributes {
  username: string
  password: string
  type: keyof typeof UserTypes
}

export interface UserDoc extends UserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserModel extends Model<UserDoc> {
  build(input: UserAttributes): UserDoc
}
