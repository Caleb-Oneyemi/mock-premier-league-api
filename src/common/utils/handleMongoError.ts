import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { logger } from '../logger'
import { mongoErrors } from '../constants'
import { FormatMongoErrorInput, FormatMongoErrorResult } from '../../types'

const { CastError, ValidationError } = mongoose.Error

interface DefaultError {
  status: 500
  errors: Array<{ message: string }>
}

export const formatMongoError = (
  err: FormatMongoErrorInput,
  defaultError: DefaultError,
): FormatMongoErrorResult => {
  try {
    if (err instanceof CastError) {
      const message = `Invalid ${err.path}`
      return {
        status: httpStatus.BAD_REQUEST,
        errors: [{ message, field: err.path }],
      }
    }

    if (err instanceof ValidationError) {
      const [key] = Object.keys(err.errors)
      const message = `Invalid ${err.errors[key].path}`
      return {
        status: httpStatus.BAD_REQUEST,
        errors: [{ message, field: err.errors[key].path }],
      }
    }

    if (err?.code === 11000) {
      const keys = Object.keys(err.keyValue!)
      return {
        status: httpStatus.CONFLICT,
        errors: [{ message: `${keys.join(' and ')} already exists` }],
      }
    }

    logger.error(err)
    return defaultError
  } catch (err) {
    logger.error(err)
    return defaultError
  }
}

export const isMongoError = (err: Error) => {
  return Object.keys(mongoErrors).includes(err.name)
}
