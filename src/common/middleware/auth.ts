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
      return user
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new AuthenticationError('session expired, login again')
      }

      throw new AuthenticationError('invalid token')
    }
  }

  static async isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Auth.authenticate(req)
      if (user?.role === UserTypes.ADMIN_USER) {
        return next()
      }

      next(new AuthorizationError('permission denied'))
    } catch (err) {
      next(err)
    }
  }

  static async isAppUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await Auth.authenticate(req)
      if (user?.role === UserTypes.APP_USER) {
        return next()
      }

      next(new AuthorizationError('permission denied'))
    } catch (err) {
      next(err)
    }
  }
}
