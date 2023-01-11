import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken, UserTypes } from '../../../common'
import { testRedis } from '../../../test/helpers'

const request = supertest(app)

const id = 'editFixtureId'
const validToken = generateToken(id)
const validSession = JSON.stringify({
  username: 'editFixture',
  role: UserTypes.ADMIN_USER,
})
const defaultFixture = {
  homeTeam: '63bd75b6c3398c4ebdccd30e',
  awayTeam: '63bd84a457c871dd8ce30d25',
  status: 'pending',
  date: `10/10/${new Date().getFullYear() + 1}`,
}

describe('Edit Fixture Tests', () => {
  test('Editing fixture fails when user is not authenticated', async () => {
    const result = await request.patch('/api/fixtures/publicId').send({})

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Editing fixture fails when authenticated user is not an admin', async () => {
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: 'editFixtureUser',
      role: UserTypes.APP_USER,
    })

    await testRedis.set(id, sessionValue)

    const result = await request
      .patch(`/api/fixtures/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Editing fixture with authenticated admin fails validation when no input is provided', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .patch(`/api/fixtures/${id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({})

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        { message: 'update must contain at least one property', field: '' },
      ],
      isSuccess: false,
    })
  })

  test('Editing fixture with authenticated admin fails validation when valid status is not provided', async () => {
    await testRedis.set(id, validSession)

    const invalidStatus = 'done'
    const result = await request
      .patch(`/api/fixtures/${id}`)
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

  test('Editing fixture with authenticated admin fails validation when date is not in the valid DD/MM/YYYY format', async () => {
    await testRedis.set(id, validSession)

    const invalidDate = '2023/11/01'
    const result = await request
      .patch(`/api/fixtures/${id}`)
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

  test('Editing fixture with authenticated admin fails validation when date is not in the future', async () => {
    await testRedis.set(id, validSession)

    const invalidDate = '01/11/2020'
    const result = await request
      .patch(`/api/fixtures/${id}`)
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

  test('Editing fixture with authenticated admin fails validation when fixture with Id does not exist', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .patch(`/api/fixtures/${id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        status: 'completed',
      })

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [{ message: 'fixture does not exist' }],
      isSuccess: false,
    })
  })

  test('Editing fixture with authenticated admin fails validation when homeTeam or awayTeam mongo Ids are invalid', async () => {
    await testRedis.set(id, validSession)
    const createResult = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(defaultFixture)

    const publicId = createResult.body.data.publicId
    const result = await request
      .patch(`/api/fixtures/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        awayTeam: 'invalidId2',
        homeTeam: 'invalidId1',
      })

    expect(createResult.statusCode).toBe(201)
    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'Invalid awayTeam',
          field: 'awayTeam',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Editing fixture with authenticated admin fails validation when edit makes both team mongo Ids the same', async () => {
    await testRedis.set(id, validSession)
    const createResult = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(defaultFixture)

    const publicId = createResult.body.data.publicId
    const result = await request
      .patch(`/api/fixtures/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        awayTeam: defaultFixture.homeTeam,
      })

    expect(createResult.statusCode).toBe(201)
    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'home and away team cannot be the same',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Editing fixture with authenticated admin fails when fixture with home and away team already exists', async () => {
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
      .send({
        ...fixture,
        awayTeam: fixture.homeTeam,
        homeTeam: fixture.awayTeam,
      })

    const publicId = first.body.data.publicId
    const result = await request
      .patch(`/api/fixtures/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        awayTeam: fixture.homeTeam,
        homeTeam: fixture.awayTeam,
      })

    expect(first.statusCode).toBe(201)
    expect(second.statusCode).toBe(201)
    expect(result.statusCode).toBe(409)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'homeTeam and awayTeam already exists',
        },
      ],
      isSuccess: false,
    })
  })

  test('Editing fixture succeeds when all requirements are met', async () => {
    await testRedis.set(id, validSession)
    const createResult = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(defaultFixture)

    const publicId = createResult.body.data.publicId
    const day = 12
    const month = 10
    const year = new Date().getFullYear() + 1
    const defaultDay = +defaultFixture.date.split('/')[0]

    const update = {
      awayTeam: defaultFixture.homeTeam,
      homeTeam: defaultFixture.awayTeam,
      status: 'completed',
      date: `${day}/${month}/${year}`,
    }

    const result = await request
      .patch(`/api/fixtures/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send(update)

    expect(createResult.statusCode).toBe(201)
    expect(result.statusCode).toBe(200)
    expect(new Date(result.body.data.date).getDate()).toBe(day)
    expect(new Date(result.body.data.date).getDate()).not.toBe(defaultDay)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        awayTeam: update.awayTeam,
        homeTeam: update.homeTeam,
        status: update.status,
      }),
      isSuccess: true,
    })
  })
})
