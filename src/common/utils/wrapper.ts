import { Request, NextFunction } from 'express'
import { ZodError } from 'zod'

import { BadRequestError } from '../errors'
import { ControllerFn, CustomResponse } from '../types'
import { getCachedResponse, handleCachingOperations } from './cache'

export const wrapCtrl = (status: number, fn: ControllerFn) => {
  return async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const {
        body,
        params,
        query,
        user,
        method,
        url,
        useCache,
        clearCache,
        hashKey,
      } = req

      let result
      if (method.toLowerCase() === 'get' && useCache && hashKey) {
        result = await getCachedResponse(hashKey, req.url)

        if (result != null) {
          return res.status(status).send({
            isSuccess: true,
            data: result ? result : null,
          })
        }
      }

      result = await fn({ input: body, params, query, user })

      // writes to cache if GET request or clears cache otherwise
      handleCachingOperations({
        method,
        url,
        hashKey,
        useCache,
        clearCache,
        data: result,
      })

      res.status(status).send({
        isSuccess: true,
        data: result ? result : null,
      })
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new BadRequestError(err))
      }

      next(err)
    }
  }
}
