import { Document, Model } from 'mongoose'

export interface TeamAttributes {
  name: string
  foundingYear: string
  stadium: string
  owner: string
  coach?: string
  playerCount?: number
  matches?: number
  goals?: number
}

export interface TeamDoc extends TeamAttributes, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

export interface TeamModel extends Model<TeamDoc> {
  build(input: TeamAttributes): TeamDoc
}
