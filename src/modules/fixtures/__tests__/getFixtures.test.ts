import supertest from 'supertest'
import { Fixture } from '../models'
import { app } from '../../../app'
import { fixtures } from '../../../test/helpers'

const request = supertest(app)

const baseUrl = 'http://url.com'
const totalRecords = fixtures.length

beforeEach(async () => {
  await Fixture.insertMany(fixtures)
})

describe('Get Fixtures Tests', () => {
  test('Getting fixtures fails when page query is not a valid number', async () => {
    const result = await request.get('/api/fixtures?page=a').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Expected number, received nan', field: 'page' }],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when limit query is not a valid number', async () => {
    const result = await request.get('/api/fixtures?limit=a').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Expected number, received nan', field: 'limit' }],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when sort query is neither asc nor desc', async () => {
    const result = await request.get('/api/fixtures?sort=ascending').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message:
            "Invalid enum value. Expected 'asc' | 'desc', received 'ascending'",
          field: 'sort',
        },
      ],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when search query does not have any characters', async () => {
    const result = await request.get('/api/fixtures?search=').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at least 1 character(s)',
          field: 'search',
        },
      ],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when search query has more than 50 characters', async () => {
    const result = await request
      .get(`/api/fixtures?search=${'a'.repeat(51)}`)
      .send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'String must contain at most 50 character(s)',
          field: 'search',
        },
      ],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when status query is neither pending nor completed', async () => {
    const result = await request.get('/api/fixtures?status=done').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message:
            "Invalid enum value. Expected 'pending' | 'completed', received 'done'",
          field: 'status',
        },
      ],
      isSuccess: false,
    })
  })

  test('Getting fixtures fails when dateAfter or dateBefore is not a valid date', async () => {
    const result = await request
      .get('/api/fixtures?dateAfter=a&dateBefore=2035/10/10')
      .send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: expect.arrayContaining([
        {
          message: 'date must be in the format DD/MM/YYYY',
          field: 'dateAfter',
        },
        {
          message: 'date must be in the format DD/MM/YYYY',
          field: 'dateBefore',
        },
      ]),
      isSuccess: false,
    })
  })

  test('Getting fixtures succeeds without invalid queries and returns valid fixture link', async () => {
    const result = await request.get('/api/fixtures').send()

    const fixtureLink = result.body.data.fixtures[0].link
    const endpoint = fixtureLink.replace(baseUrl, '')

    const getResponse = await request.get(endpoint).send()

    expect(result.statusCode).toBe(200)
    expect(getResponse.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: {
        fixtures: expect.arrayContaining([
          expect.objectContaining({
            status: fixtures[0].status,
            link: baseUrl + '/' + fixtures[0].link,
          }),
        ]),
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      },
      isSuccess: true,
    })
    expect(result.body.data.fixtures.length).toBe(totalRecords)
    expect(getResponse.body.data.status).toBeDefined()
    expect(getResponse.body.data.date).toBeDefined()
  })

  test('Getting fixtures succeeds with valid status query', async () => {
    const status = 'pending'
    const result = await request.get(`/api/fixtures?status=${status}`).send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: {
        fixtures: expect.arrayContaining([
          expect.objectContaining({
            status,
          }),
          expect.objectContaining({
            status,
          }),
          expect.objectContaining({
            status,
          }),
          expect.objectContaining({
            status,
          }),
          expect.objectContaining({
            status,
          }),
        ]),
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      },
      isSuccess: true,
    })
    expect(result.body.data.fixtures.length).toBe(5)
  })

  test('Getting fixtures succeeds with valid dateBefore query', async () => {
    const dateBefore = '10/10/2031'
    const result = await request
      .get(`/api/fixtures?dateBefore=${dateBefore}`)
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body.data.fixtures.length).toBe(1)
    expect(result.body.data.fixtures[0]).toMatchObject({
      publicId: fixtures[0].publicId,
      link: baseUrl + '/' + fixtures[0].link,
      status: fixtures[0].status,
    })
  })

  test('Getting fixtures succeeds with valid dateAfter query', async () => {
    const dateAfter = '10/10/2038'
    const result = await request
      .get(`/api/fixtures?dateAfter=${dateAfter}`)
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body.data.fixtures.length).toBe(1)
    expect(result.body.data.fixtures[0]).toMatchObject({
      publicId: fixtures[9].publicId,
      link: baseUrl + '/' + fixtures[9].link,
      status: fixtures[9].status,
    })
  })

  test('Getting fixtures succeeds with valid multiple queries', async () => {
    const dateBefore = '10/10/2036'
    const dateAfter = '10/10/2033'
    const status = 'pending'

    const result = await request
      .get(
        `/api/fixtures?status=${status}&dateAfter=${dateAfter}&dateBefore=${dateBefore}`,
      )
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body.data.fixtures.length).toBe(1)
    expect(result.body.data.fixtures[0]).toMatchObject({
      publicId: fixtures[4].publicId,
      link: baseUrl + '/' + fixtures[4].link,
      status,
    })
  })
})
