import supertest from 'supertest'
import { app } from '../../../app'
import { generateToken, UserTypes } from '../../../common'
import { testRedis } from '../../../test/helpers'

const request = supertest(app)

const id = 'deleteTeamId'
const validToken = generateToken(id)
const validSession = JSON.stringify({
  username: 'editTeam',
  role: UserTypes.ADMIN_USER,
})

describe('Delete Team Tests', () => {
  test('Deleting team fails when user is not authenticated', async () => {
    const result = await request.delete('/api/teams/publicId').send()

    expect(result.statusCode).toBe(401)
    expect(result.body).toEqual({
      errors: [{ message: 'not authenticated' }],
      isSuccess: false,
    })
  })

  test('Deleting team fails when authenticated user is not an admin', async () => {
    const token = generateToken(id)
    const sessionValue = JSON.stringify({
      username: 'username',
      role: UserTypes.APP_USER,
    })

    await testRedis.set(id, sessionValue)

    const result = await request
      .delete(`/api/teams/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(result.statusCode).toBe(403)
    expect(result.body).toEqual({
      errors: [{ message: 'permission denied' }],
      isSuccess: false,
    })
  })

  test('Deleting team with authenticated admin fails when team with publicId does not exist', async () => {
    await testRedis.set(id, validSession)

    const result = await request
      .delete(`/api/teams/${id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send()

    expect(result.statusCode).toBe(404)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'team does not exist',
        },
      ],
      isSuccess: false,
    })
  })

  test('Deleting team with authenticated admin succeeds when team exists', async () => {
    await testRedis.set(id, validSession)
    const team = {
      name: 'manchester_united',
      foundingYear: 1995,
      stadium: 'old trafford',
      owner: 'owner',
    }

    const { statusCode, body } = await request
      .post('/api/teams')
      .set('Authorization', `Bearer ${validToken}`)
      .send(team)

    const publicId = body.data.publicId
    const result = await request
      .delete(`/api/teams/${publicId}`)
      .set('Authorization', `Bearer ${validToken}`)
      .send()

    expect(statusCode).toBe(201)
    expect(result.statusCode).toBe(204)
  })
})
