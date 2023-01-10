import { Router } from 'express'
import { userRoutes } from './users/routes'
import { teamRoutes } from './teams/routes'
import { fixtureRoutes } from './fixtures/routes'

const router = Router()

router.use('/api/users', userRoutes)

router.use('/api/teams', teamRoutes)

router.use('/api/fixtures', fixtureRoutes)

export { router as ApiRouter }
