import { UserTypes } from '../constants'
import { client as redis } from '../redisClient'

interface SessionPayload {
  id: string
  username: string
  role: keyof typeof UserTypes
  expires?: number
}

/** Default expiry is 7 days */
export const storeSession = async ({
  id,
  username,
  role,
  expires,
}: SessionPayload) => {
  const sessionValue = JSON.stringify({ username, role })
  const sevenDays = 60 * 60 * 24 * 7
  const exp = expires ? expires : sevenDays

  return redis.set(id, sessionValue, 'EX', exp)
}

export const getSession = async (
  id: string,
): Promise<Pick<SessionPayload, 'username' | 'role'> | null> => {
  const value = await redis.get(id)
  if (value === null) {
    return value
  }

  return JSON.parse(value)
}
