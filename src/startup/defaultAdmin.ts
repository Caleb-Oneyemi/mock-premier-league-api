import config from 'config'
import { logger, hashPassword, generatePublicId } from '../common'
import { createAdminUser, getUserByUsername } from '../modules/users/dal'

const username: string = config.get('admin.username')
const password: string = config.get('admin.password')

export const createDefaultAdminUser = async () => {
  const adminUser = await getUserByUsername(username)
  if (adminUser) {
    return 'admin user already created'
  }

  const [hashedPassword, publicId] = await Promise.all([
    hashPassword(password),
    generatePublicId(),
  ])

  await createAdminUser({ username, publicId, password: hashedPassword })
  return 'admin user created successfully'
}

createDefaultAdminUser()
  .then((res) => logger.debug(res))
  .catch((err) => {
    logger.warn(`failed to create default admin user because ${err}`)
  })
