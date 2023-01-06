import config from 'config'

import { app } from './app'
import { logger } from './common'

const port = config.get<number>('port')

const server = app.listen(port, () => {
  logger.debug(`listening on port ${port}...`)
})

const exceptionHandler = (error: Error) => {
  logger.error(error)
  if (server) {
    server.close()
  }

  process.exit(1)
}

process.on('uncaughtException', exceptionHandler)
process.on('unhandledRejection', exceptionHandler)
