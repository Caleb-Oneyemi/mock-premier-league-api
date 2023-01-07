import config from 'config'
import { Request, Response, NextFunction } from 'express'

import { RateLimitError } from '../errors'
import { rateLimiterRedis } from '../rateLimiterRedis'

const env = config.get<string>('env')

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (env === 'test') {
    return next()
  }

  try {
    await rateLimiterRedis.consume(req.ip)
    next()
  } catch (err: any) {
    if (err instanceof Error) {
      return next(err)
    }

    const retryAfter = String(Math.round(err.msBeforeNext / 1000) || 1)
    res.setHeader('Retry-After', retryAfter)
    next(new RateLimitError('request limit exceeded'))
  }
}
