import { Router } from 'express'
import { CREATED, OK, NO_CONTENT } from 'http-status'

import * as Ctrl from '../controllers'
import {
  Auth,
  clearCache,
  rateLimiter,
  useCache,
  wrapCtrl,
} from '../../../common'

const router = Router()

router
  .get('/', rateLimiter, useCache('team'), wrapCtrl(OK, Ctrl.getTeams))
  .post('/', [
    Auth.allowAdmin,
    clearCache('team'),
    wrapCtrl(CREATED, Ctrl.addTeam),
  ])
  .patch('/:publicId', [
    Auth.allowAdmin,
    clearCache('team'),
    wrapCtrl(OK, Ctrl.editTeam),
  ])
  .delete('/:publicId', [
    Auth.allowAdmin,
    clearCache('team'),
    wrapCtrl(NO_CONTENT, Ctrl.removeTeam),
  ])

export { router as teamRoutes }
