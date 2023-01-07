import config from 'config'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { client } from './redisClient'

interface RateLimiterConfig {
  allowedRequestsInWindow: string
  requestWindowInSeconds: string
  retryAfterInSeconds: string
}

const {
  allowedRequestsInWindow: points,
  requestWindowInSeconds: duration,
  retryAfterInSeconds: blockDuration,
} = config.get<RateLimiterConfig>('rateLimiter')

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'LIMITER',
  points: parseInt(points) || 100,
  duration: parseInt(duration) || 5,
  blockDuration: parseInt(blockDuration) || 60 * 5,
})

export { rateLimiterRedis }
