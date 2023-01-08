import { Router } from 'express'
import { CREATED, OK } from 'http-status'

import * as Ctrl from '../controllers'
import { Auth, rateLimiter, wrapCtrl } from '../../../common'

const router = Router()

router.post('/', rateLimiter, wrapCtrl(CREATED, Ctrl.createAppUser))

router.post('/login', wrapCtrl(OK, Ctrl.login))

router.post('/admin', Auth.allowAdmin, wrapCtrl(CREATED, Ctrl.createAdminUser))

export { router as userRoutes }
