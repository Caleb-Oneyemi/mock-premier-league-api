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

export type EditTeamInput = Partial<Omit<TeamAttributes, 'name'>>

export interface NumberQuery {
  minPlayerCount?: string
  maxPlayerCount?: string
  minMatches?: string
  maxMatches?: string
  minGoals?: string
  maxGoals?: string
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
