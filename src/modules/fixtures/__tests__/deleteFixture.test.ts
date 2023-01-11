import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken, UserTypes } from '../../../common'
import { testRedis } from '../../../test/helpers'

const request = supertest(app)

const id = 'deleteFixtureId'
const validToken = generateToken(id)
const validSession = JSON.stringify({
  username: 'deleteFixture',
  role: UserTypes.ADMIN_USER,
})

describe('Delete Fixture Tests', () => {
  test('Deleting fixture fails when user is not authenticated', async () => {
    const result = await request.delete('/api/fixtures/publicId').send()

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Deleting fixture fails when authenticated user is not an admin', async () => {
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: 'username',
      role: UserTypes.APP_USER,
    })

    await testRedis.set(id, sessionValue)

    const result = await request
      .delete(`/api/fixtures/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Deleting fixture with authenticated admin fails when fixture with publicId does not exist', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .delete(`/api/fixtures/${id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send()

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'fixture does not exist',
        },
      ],
      isSuccess: false,
    })
  })

  test('Deleting fixture with authenticated admin succeeds when fixture exists', async () => {
    await testRedis.set(id, validSession)
    const fixture = {
      homeTeam: '63bd75b6c3398c4ebdccd30e',
      awayTeam: '63bd84a457c871dd8ce30d25',
      status: 'pending',
      date: `10/10/${new Date().getFullYear() + 1}`,
    }

    const { statusCode, body } = await request
      .post('/api/fixtures')
      .set('Authorization', `Bearer ${validToken}`)
      .send(fixture)

    const publicId = body.data.publicId
    const result = await request
      .delete(`/api/fixtures/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send()

    expect(statusCode).toBe(201)
    expect(result.statusCode).toBe(204)
  })
})
