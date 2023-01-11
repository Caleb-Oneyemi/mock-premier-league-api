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

describe('Add Fixture Tests', () => {
  test('Fixture creation fails when user is not authenticated', async () => {
    const result = await request.post('/api/fixtures').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Fixture creation fails when authenticated user is not an admin', async () => {
    const id = 'publicId'
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: 'username',
      role: UserTypes.APP_USER,
    })

    await testRedis.set(id, sessionValue)

    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails validation when required input is not provided', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'Required', field: 'homeTeam' },
        { message: 'Required', field: 'awayTeam' },
        { message: 'Required', field: 'status' },
        { message: 'Required', field: 'date' },
      ],
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails validation when valid status is not provided', async () => {
    await testRedis.set(id, validSession)

    const invalidStatus = 'done'
    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ status: invalidStatus })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: `Invalid enum value. Expected 'pending' | 'completed', received '${invalidStatus}'`,
          field: 'status',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails validation when date is not in the valid DD/MM/YYYY format', async () => {
    await testRedis.set(id, validSession)

    const invalidDate = '2023/11/01'
    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ date: invalidDate })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'date must be in the format DD/MM/YYYY',
          field: 'date',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails validation when date is not in the future', async () => {
    await testRedis.set(id, validSession)

    const invalidDate = '01/11/2020'
    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ date: invalidDate })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'date must be a valid date in the future',
          field: 'date',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails validation when home team and away team are the same', async () => {
    await testRedis.set(id, validSession)

    const sameTeamId = '63bd75b6c3398c4ebdccd30e'
    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        homeTeam: sameTeamId,
        awayTeam: sameTeamId,
        status: 'pending',
        date: `10/10/${new Date().getFullYear() + 1}`,
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'home and away team cannot be the same',
          field: '',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails when homeTeam or awayTeam mongo Ids are invalid', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        homeTeam: 'invalidId1',
        awayTeam: 'invalidId2',
        status: 'completed',
        date: `10/10/${new Date().getFullYear() + 1}`,
      })

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'Invalid homeTeam',
          field: 'homeTeam',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Fixture creation with authenticated admin fails when fixture with home and away team already exists', async () => {
    await testRedis.set(id, validSession)
    const fixture = {
      homeTeam: '63bd75b6c3398c4ebdccd30e',
      awayTeam: '63bd84a457c871dd8ce30d25',
      status: 'completed',
      date: `10/10/${new Date().getFullYear() + 1}`,
    }

    const first = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(fixture)
    const second = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(fixture)

    expect(first.statusCode).toBe(201)
    expect(second.statusCode).toBe(409)
    expect(second.body).toEqual({
      errors: [
        {
          message: 'homeTeam and awayTeam already exists',
        },
      ],
      isSuccess: false,
    })
  })

  test('Fixture creation succeeds when all requirements are met', async () => {
    await testRedis.set(id, validSession)

    const day = 10
    const month = 10
    const year = new Date().getFullYear() + 1

    const fixture = {
      homeTeam: '63bd75b6c3398c4ebdccd30e',
      awayTeam: '63bd84a457c871dd8ce30d25',
      status: 'completed',
      date: `${day}/${month}/${year}`,
    }
    const result = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(fixture)

    expect(result.statusCode).toBe(201)
    expect(result.body.data.link).toMatch(result.body.data.publicId)
    expect(new Date(result.body.data.date).getMonth()).toBe(month - 1)
    expect(new Date(result.body.data.date).toString()).toMatch('Oct')
    expect(result.body).toEqual({
      data: expect.objectContaining({
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        status: fixture.status,
      }),
      isSuccess: true,
    })
  })
})
