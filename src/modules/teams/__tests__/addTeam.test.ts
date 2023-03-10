import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken, UserTypes } from '../../../common'
import { testRedis } from '../../../test/helpers'

const request = supertest(app)

const id = 'addTeamId'
const validToken = generateToken(id)
const validSession = JSON.stringify({
  username: 'addTeam',
  role: UserTypes.ADMIN_USER,
})

describe('Add Team Tests', () => {
  test('Team creation fails when user is not authenticated', async () => {
    const result = await request.post('/api/teams').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Team creation fails when authenticated user is not an admin', async () => {
    const id = 'publicId'
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: 'username',
      role: UserTypes.APP_USER,
    })

    await testRedis.set(id, sessionValue)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when required input is not provided', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'name' },
        { message: 'Required', field: 'foundingYear' },
        { message: 'Required', field: 'stadium' },
        { message: 'Required', field: 'owner' },
      ],
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when name, stadium, owner or coach is below 2 characters long', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'a', stadium: 'b', owner: 'c', coach: 'd' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'String must contain at least 2 character(s)',
          field: 'stadium',
        },
        {
          message: 'String must contain at least 2 character(s)',
          field: 'name',
        },
        {
          message: 'String must contain at least 2 character(s)',
          field: 'owner',
        },
        {
          message: 'String must contain at least 2 character(s)',
          field: 'coach',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when name, stadium, owner or coach is more than 50 characters long', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        name: 'a'.repeat(51),
        stadium: 'b'.repeat(51),
        owner: 'c'.repeat(51),
        coach: 'd'.repeat(51),
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'String must contain at most 50 character(s)',
          field: 'name',
        },
        {
          message: 'String must contain at most 50 character(s)',
          field: 'stadium',
        },
        {
          message: 'String must contain at most 50 character(s)',
          field: 'owner',
        },
        {
          message: 'String must contain at most 50 character(s)',
          field: 'coach',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when name contains numbers or special characters besides underscore', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ name: 'name@1' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message:
            'name must either only alphabets or alphabets with underscore',
          field: 'name',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when foundingYear is not a number', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ foundingYear: 'string' })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'Expected number, received string',
          field: 'foundingYear',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when foundingYear is before 1992', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ foundingYear: 1899 })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'Number must be greater than or equal to 1992',
          field: 'foundingYear',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when foundingYear is in the future', async () => {
    await testRedis.set(id, validSession)

    const year = new Date().getFullYear() + 1
    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ foundingYear: year })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: `Number must be less than or equal to ${year - 1}`,
          field: 'foundingYear',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin fails validation when playerCount, matches or goals are not positive numbers', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ playerCount: -1, matches: 'fifty', goals: {} })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'Number must be greater than 0',
          field: 'playerCount',
        },
        {
          message: 'Expected number, received string',
          field: 'matches',
        },
        {
          message: 'Expected number, received object',
          field: 'goals',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Team creation with authenticated admin succeeds when all requirements are met', async () => {
    await testRedis.set(id, validSession)
    const team = {
      name: 'manchester_united',
      foundingYear: 1995,
      stadium: 'old trafford',
      owner: 'owner',
      coach: 'coach',
      playerCount: 21,
      matches: 100,
      goals: 210,
    }

    const result = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send(team)

    expect(result.statusCode).toBe(201)
    expect(result.body.data.publicId).toBeDefined()
    expect(result.body).toEqual({
      data: expect.objectContaining(team),
      isSuccess: true,
    })
  })
})
