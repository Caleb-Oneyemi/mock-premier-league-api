import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, colorize, timestamp, printf } = format

export const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(({ timestamp, level, message, stack }) => {
      if (stack) {
        return `[mock-premier-league-api: ${timestamp} ${level}: ${stack}`
      }

      return `[mock-premier-league-api: ${timestamp as string}] ${level}: ${message}`
    }),
  ),
  transports: [new transports.Console()],
})
