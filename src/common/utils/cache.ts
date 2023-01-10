import config from 'config'
import mongoose from 'mongoose'
import { logger } from '../logger'
import { client as redis } from '../redisClient'
import { Resource, ResponseData } from '../../types'

const TTL = config.get<string>('cache.ttlInDays')

const model = mongoose.Query.prototype.model

type ModelType = typeof model

interface CacheApiInput {
  data: ResponseData
  method: string
  url: string
  hashKey?: Resource
  useCache?: boolean
  clearCache?: boolean
  ttl?: string
}

export const getCachedResponse = async (
  hashKey: Resource,
  key: string,
): Promise<Array<ModelType> | ModelType | null> => {
  const cachedResponse = await redis.hget(hashKey, key)
  if (!cachedResponse) return null

  const response = JSON.parse(cachedResponse)
  return response
}

/** Writes to cache if request method is GET, useCache is true and hashKey is present.
 * Clears cache if method is not GET, clearCache is true and hasKey is present
 * Also has a Default TTL of 3 days */
export const handleCachingOperations = ({
  method,
  url,
  useCache,
  clearCache,
  hashKey,
  data,
}: CacheApiInput) => {
  if (method.toLowerCase() === 'get' && useCache && hashKey) {
    const days = Number(TTL) > 0 ? Number(TTL) : 3
    const expires = 60 * 60 * 24 * days
    redis
      .hset(hashKey, url, JSON.stringify(data), 'EX', expires)
      .catch((err) => {
        logger.warn(
          `Error caching api response with hash key ${hashKey} because ${err}`,
        )
      })
  }

  if (method.toLowerCase() !== 'get' && clearCache && hashKey) {
    redis.del(hashKey).catch((err) => {
      logger.warn(
        `Error clearing cache with hash key ${hashKey} because ${err}`,
      )
    })
  }
}
