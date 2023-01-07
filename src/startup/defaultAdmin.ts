import config from 'config'
import { logger, hashPassword } from '../common'
import { createAdminUser, getUserByUsername } from '../modules/users/dal'

const username: string = config.get('admin.username')
const pass: string = config.get('admin.password')

export const createDefaultAdminUser = async () => {
  const adminUser = await getUserByUsername(username)

  if (adminUser) {
    return 'admin user already created'
  }

  const password = await hashPassword(pass)
  await createAdminUser({ username, password })
  return 'admin user created successfully'
}

createDefaultAdminUser()
  .then((res) => logger.debug(res))
  .catch((err) => {
    logger.warn(`failed to create default admin user because ${err}`)
  })
