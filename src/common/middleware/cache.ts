import { Request, Response, NextFunction } from 'express'
import { Resource } from '../types'

export const useCache = (hashKey: Resource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.useCache = true
    req.hashKey = hashKey
    next()
  }
}

export const clearCache = (hashKey: Resource) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.clearCache = true
    req.hashKey = hashKey
    next()
  }
}
