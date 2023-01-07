import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface Payload {
  id: string
}

/** Default expiry is 7 days */
export const generateToken = (id: string, expires?: number): string => {
  const signature = config.get<string>('jwtSecret')
  const token = jwt.sign({ id }, signature, {
    expiresIn: expires ? expires : '7d',
  })
  return token
}

export const validateToken = (token: string) => {
  const signature = config.get<string>('jwtSecret')
  const payload = jwt.verify(token, signature) as Payload & JwtPayload
  return payload
}
