import Redis from 'ioredis'
import config from 'config'
import { logger } from './common'

const url = config.get<string>('redisUrl')

export const client = new Redis(url, {
  lazyConnect: true,
})

client.on('error', (err) => {
  logger.error(err)
})
