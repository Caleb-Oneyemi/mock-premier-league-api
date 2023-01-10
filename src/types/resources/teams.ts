import { Document, Model } from 'mongoose'

export interface TeamAttributes {
  publicId: string
  name: string
  foundingYear: number
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

export type EditTeamInput = Partial<Omit<TeamAttributes, 'publicId'>>

export interface NumberQuery {
  minPlayerCount?: number
  maxPlayerCount?: number
  minMatches?: number
  maxMatches?: number
  minGoals?: number
  maxGoals?: number
}

interface Range {
  $lte?: number
  $gte?: number
}

export interface NumberFilter {
  playerCount?: Range
  matches?: Range
  goals?: Range
}

export type TeamFilter = NumberFilter &
  Partial<Pick<TeamAttributes, 'coach' | 'name' | 'owner' | 'stadium'>>

type Search = { $regex: string; $options: 'i' }

export type TeamFilterQuery = {
  $or?: [
    { coach: Search },
    { name: Search },
    { owner: Search },
    { stadium: Search },
  ]
} & NumberFilter
