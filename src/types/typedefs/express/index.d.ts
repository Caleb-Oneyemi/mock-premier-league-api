import { RequestUser } from '../../user'
import { Resource } from '../../resources'

declare module 'express' {
  interface Request {
    user?: RequestUser
    useCache?: boolean
    clearCache?: boolean
    hashKey?: Resource
  }
}
