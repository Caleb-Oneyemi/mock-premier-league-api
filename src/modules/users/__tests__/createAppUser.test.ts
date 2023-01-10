import supertest from 'supertest'
import { app } from '../../../app'
import { UserTypes } from '../../../common'

const request = supertest(app)

const user = {
  username: 'username',
  password: 'strongPassword135&',
}

describe('Create App User Tests', () => {
  test('User creation fails validation when required input is not provided', async () => {
    const result = await request.post('/api/users').send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'username' },
        { message: 'Required', field: 'password' },
      ],
      isSuccess: false,
    })
  })

  test('User creation fails validation when username is below 2 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...user, username: 'a' })

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

  test('User creation fails validation when username is above 50 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...user, username: 'a'.repeat(51) })

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

  test('User creation fails validation when password is below 8 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...user, password: '$Tr0ng' })

    expect(result.statusCode).toBe(400)
    expect(result.body.isSuccess).toBe(false)
    expect(result.body.errors[0]).toEqual({
      message: 'String must contain at least 8 character(s)',
      field: 'password',
    })
  })

  test('User creation fails validation when password is above 50 characters', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...user, password: '$Tr0ng' + 'a'.repeat(50) })

    expect(result.statusCode).toBe(400)
    expect(result.body.isSuccess).toBe(false)
    expect(result.body.errors[0]).toEqual({
      message: 'String must contain at most 50 character(s)',
      field: 'password',
    })
  })

  test('User creation fails validation when password is not a strong password', async () => {
    const result = await request
      .post('/api/users')
      .send({ ...user, password: 'password' })

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

  test('User creation fails when user with username already exists', async () => {
    await request.post('/api/users').send(user)
    const badResult = await request.post('/api/users').send(user)

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

  test('User creation succeeds when all requirements are met', async () => {
    const result = await request.post('/api/users').send(user)

    expect(result.statusCode).toBe(201)
    expect(result.body.data).not.toHaveProperty('password')
    expect(result.body.data).toHaveProperty('publicId')
    expect(result.body.data).toHaveProperty('createdAt')
    expect(result.body).toMatchObject({
      data: {
        username: user.username,
        role: UserTypes.APP_USER,
      },
      isSuccess: true,
    })
  })
})
