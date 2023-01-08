import { Router } from 'express'
import { userRoutes } from './users/routes'
import { teamRoutes } from './teams/routes'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/teams', teamRoutes)

export { router as ApiRouter }
