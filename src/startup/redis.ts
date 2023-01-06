import { client } from '../redisClient'
import { logger } from '../common'

client
  .connect()
  .then(() => logger.debug('Connected to Redis'))
  .catch((err) => {
    logger.error(`Failed to connect to Redis: ${err.message}`)
    process.exit(1)
  })
