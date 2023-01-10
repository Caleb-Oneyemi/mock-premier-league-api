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
  .get('/', rateLimiter, useCache('fixture'), wrapCtrl(OK, Ctrl.getFixtures))
  .get('/:publicId', [
    rateLimiter,
    useCache('fixture'),
    wrapCtrl(OK, Ctrl.getFixtureByPublicId),
  ])
  .post('/', [
    Auth.allowAdmin,
    clearCache('fixture'),
    wrapCtrl(CREATED, Ctrl.addFixture),
  ])
  .patch('/:publicId', [
    Auth.allowAdmin,
    clearCache('fixture'),
    wrapCtrl(OK, Ctrl.editFixture),
  ])
  .delete('/:publicId', [
    Auth.allowAdmin,
    clearCache('fixture'),
    wrapCtrl(NO_CONTENT, Ctrl.removeFixture),
  ])

export { router as fixtureRoutes }
