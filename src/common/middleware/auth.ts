import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import { AuthenticationError, AuthorizationError } from '../errors'
import { validateToken, getSession } from '../utils'
import { UserTypes } from '../constants'

export class Auth {
  private static async authenticate(req: Request) {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      throw new AuthenticationError('not authenticated')
    }

    try {
      const payload = validateToken(token)
      const user = await getSession(payload.id)

      if (!user) {
        throw new AuthenticationError('session expired, login again')
      }
      return { ...user, publicId: payload.id }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AuthenticationError('session expired, login again')
      }

      throw new AuthenticationError('invalid token')
    }
  }

  static async allowAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Auth.authenticate(req)
      if (user?.role === UserTypes.ADMIN_USER) {
        req.user = user
        return next()
      }

      next(new AuthorizationError('permission denied'))
    } catch (err) {
      next(err)
    }
  }

  static async allowAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Auth.authenticate(req)
      if (
        user?.role === UserTypes.APP_USER ||
        user?.role === UserTypes.ADMIN_USER
      ) {
        req.user = user
        return next()
      }

      next(new AuthorizationError('permission denied'))
    } catch (err) {
      next(err)
    }
  }
}
