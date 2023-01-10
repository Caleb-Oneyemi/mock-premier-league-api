import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken, UserTypes } from '../../../common'
import { testRedis } from '../../../test/redis'

const request = supertest(app)

const admin = {
  username: 'admin',
  password: 'strongPassword135&',
}

const id = 'publicId'
const validToken = generateToken(id)
const validSession = JSON.stringify({
  username: admin.username,
  role: UserTypes.ADMIN_USER,
})

describe('Create Admin User Tests', () => {
  test('Admin creation fails validation when not authenticated', async () => {
    const result = await request.post('/api/users/admin').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Admin creation fails when auth token is invalid jwt token', async () => {
    const token = 'publicId'
    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'invalid token' }],
      isSuccess: false,
    })
  })

  test('Admin creation fails when auth token has expired', async () => {
    const fiveMinutesAgo = -5 * 60000
    const expiredToken = generateToken('publicId', fiveMinutesAgo)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${expiredToken}`)
      .send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'session expired, login again' }],
      isSuccess: false,
    })
  })

  test('Admin creation fails when there is no active session for jwt token', async () => {
    const id = 'publicId'
    const token = generateToken(id)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'session expired, login again' }],
      isSuccess: false,
    })
  })

  test('Admin creation fails when active session for jwt token does not belong to an admin user', async () => {
    const id = 'publicId'
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: admin.username,
      role: UserTypes.APP_USER,
    })
    await testRedis.set(id, sessionValue)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Admin creation with valid token and session fails validation when username is below 2 characters', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ ...admin, username: 'a' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at least 2 character(s)',
          field: 'username',
        },
      ],
      isSuccess: false,
    })
  })

  test('Admin creation with valid token and session fails validation when username is above 50 characters', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ ...admin, username: 'a'.repeat(51) })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at most 50 character(s)',
          field: 'username',
        },
      ],
      isSuccess: false,
    })
  })

  test('Admin creation with valid token and session fails validation when password is below 8 characters', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ ...admin, password: '$Tr0ng' })

    expect(result.statusCode).toBe(400)
    expect(result.body.isSuccess).toBe(false)
    expect(result.body.errors[0]).toEqual({
      message: 'String must contain at least 8 character(s)',
      field: 'password',
    })
  })

  test('Admin creation with valid token and session fails validation when password is above 50 characters', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ ...admin, password: '$Tr0ng' + 'a'.repeat(50) })

    expect(result.statusCode).toBe(400)
    expect(result.body.isSuccess).toBe(false)
    expect(result.body.errors[0]).toEqual({
      message: 'String must contain at most 50 character(s)',
      field: 'password',
    })
  })

  test('Admin creation with valid token and session fails validation when password is not a strong password', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ ...admin, password: 'password' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message:
            'password must have one lowercase letter, one uppercase letter, one number and one symbol',
          field: 'password',
        },
      ],
      isSuccess: false,
    })
  })

  test('Admin creation with valid token and session fails when user with username already exists', async () => {
    await testRedis.set(id, validSession)

    await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send(admin)

    const badResult = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send(admin)

    expect(badResult.statusCode).toBe(409)
    expect(badResult.body).toEqual({
      errors: [
        {
          message: 'username already in use',
        },
      ],
      isSuccess: false,
    })
  })

  test('Admin creation with valid token and session succeeds when all requirements are met', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${validToken}`)
      .send(admin)

    expect(result.statusCode).toBe(201)
    expect(result.body.data).not.toHaveProperty('password')
    expect(result.body.data).toHaveProperty('publicId')
    expect(result.body.data).toHaveProperty('createdAt')
    expect(result.body).toMatchObject({
      data: {
        username: admin.username,
        role: 'ADMIN_USER',
      },
      isSuccess: true,
    })
  })
})
