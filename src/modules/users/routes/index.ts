import { Router } from 'express'
import { CREATED, OK } from 'http-status'

import * as Ctrl from '../controllers'
import { wrapCtrl } from '../../../common'

const router = Router()

router.post('/', wrapCtrl(CREATED, Ctrl.createUser))

router.post('/login', wrapCtrl(OK, Ctrl.loginUser))

export { router as userRoutes }
