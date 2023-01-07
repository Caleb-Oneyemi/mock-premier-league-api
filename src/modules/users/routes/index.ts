import { Router } from 'express'
import { CREATED } from 'http-status'

import * as Ctrl from '../controllers'
import { wrapCtrl } from '../../../common'

const router = Router()

router.post('/', wrapCtrl(CREATED, Ctrl.createUser))

export { router as userRoutes }
