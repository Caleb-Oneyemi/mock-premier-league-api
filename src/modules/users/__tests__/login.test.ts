import supertest from 'supertest'
import { app } from '../../../app'
import { testRedis } from '../../../test/helpers'

const request = supertest(app)

const user = {
  username: 'username2',
  password: 'strongPassword135&',
}

describe('Login Tests', () => {
  test('Login fails validation when required input is not provided', async () => {
    const result = await request.post('/api/users/login').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'username' },
        { message: 'Required', field: 'password' },
      ],
      isSuccess: false,
    })
  })

  test('Login fails when user with username does not exist', async () => {
    const result = await request.post('/api/users/login').send(user)

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'invalid credentials' }],
      isSuccess: false,
    })
  })

  test('Login fails when user with username exists but password is invalid', async () => {
    const success = await request.post('/api/users').send(user)

    const failure = await request
      .post('/api/users/login')
      .send({ ...user, password: 'Wrong password1!' })

    expect(success.statusCode).toBe(201)
    expect(failure.statusCode).toBe(401)
    expect(failure.body).toEqual({
      errors: [{ message: 'invalid credentials' }],
      isSuccess: false,
    })
  })

  test('Login succeeds and stores session when all requirements are met', async () => {
    const createResponse = await request.post('/api/users').send(user)
    const { body, statusCode } = await request
      .post('/api/users/login')
      .send(user)
    const session = await testRedis.get(body.data.user.publicId)
    const sessionData = {
      username: user.username,
      role: 'APP_USER',
    }

    expect(createResponse.statusCode).toBe(201)
    expect(statusCode).toBe(200)
    expect(body.data.password).not.toBeDefined()
    expect(body).toEqual({
      data: {
        user: expect.objectContaining(sessionData),
        token: expect.stringMatching(/^ey/),
      },
      isSuccess: true,
    })
    expect(session).toBe(JSON.stringify(sessionData))
  })
})
