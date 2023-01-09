import { RequestUser, Resource } from '../../types'

declare module 'express' {
  interface Request {
    user?: RequestUser
    useCache?: boolean
    clearCache?: boolean
    hashKey?: Resource
  }
}
