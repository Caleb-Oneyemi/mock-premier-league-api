import { Router } from 'express'
import { CREATED, OK } from 'http-status'

import * as Ctrl from '../controllers'
import { Auth, wrapCtrl } from '../../../common'

const router = Router()

router.post('/', wrapCtrl(CREATED, Ctrl.createAppUser))

router.post('/login', wrapCtrl(OK, Ctrl.login))

router.post('/admin', Auth.isAdmin, wrapCtrl(CREATED, Ctrl.createAdminUser))

export { router as userRoutes }
