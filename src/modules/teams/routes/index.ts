import { Router } from 'express'
import { CREATED, OK, NO_CONTENT } from 'http-status'

import * as Ctrl from '../controllers'
import { Auth, rateLimiter, wrapCtrl } from '../../../common'

const router = Router()

router.post('/', Auth.allowAdmin, wrapCtrl(CREATED, Ctrl.addTeam))

router.delete('/:name', Auth.allowAdmin, wrapCtrl(NO_CONTENT, Ctrl.removeTeam))

router.patch('/:name', Auth.allowAdmin, wrapCtrl(OK, Ctrl.editTeam))

router.get('/', rateLimiter, wrapCtrl(OK, Ctrl.getTeams))

export { router as teamRoutes }
