import supertest from 'supertest'
import { Team } from '../models'
import { app } from '../../../app'
import { teams } from '../../../test/helpers'

const request = supertest(app)

const totalRecords = teams.length

beforeEach(async () => {
  await Team.insertMany(teams)
})

describe('Get Teams Tests', () => {
  test('Getting teams fails when page query is not a valid number', async () => {
    const result = await request.get('/api/teams?page=a').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Expected number, received nan', field: 'page' }],
      isSuccess: false,
    })
  })

  test('Getting teams fails when limit query is not a valid number', async () => {
    const result = await request.get('/api/teams?limit=a').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'Expected number, received nan', field: 'limit' }],
      isSuccess: false,
    })
  })

  test('Getting teams fails when sort query is neither asc nor desc', async () => {
    const result = await request.get('/api/teams?sort=ascending').send()

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

  test('Getting teams fails when search query does not have any characters', async () => {
    const result = await request.get('/api/teams?search=').send()

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

  test('Getting teams fails when search query has more than 50 characters', async () => {
    const result = await request
      .get(`/api/teams?search=${'a'.repeat(51)}`)
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

  test('Getting teams fails when minPlayerCount, maxPlayerCount, minMatches, maxMatches, minGoals or maxGoals is not a positive number', async () => {
    const result = await request
      .get(
        '/api/teams?minPlayerCount=a&maxPlayerCount=b&minMatches=c&maxMatches=d&minGoals=-1&maxGoals=0',
      )
      .send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [
        {
          message: 'Expected number, received nan',
          field: 'minPlayerCount',
        },
        {
          message: 'Expected number, received nan',
          field: 'maxPlayerCount',
        },
        {
          message: 'Expected number, received nan',
          field: 'minMatches',
        },
        {
          message: 'Expected number, received nan',
          field: 'maxMatches',
        },
        {
          message: 'Number must be greater than 0',
          field: 'minGoals',
        },
        {
          message: 'Number must be greater than 0',
          field: 'maxGoals',
        },
      ],
      isSuccess: false,
    })
  })

  test('Getting teams fails if page in page query does not exist', async () => {
    const result = await request.get('/api/teams?page=2').send()

    expect(result.statusCode).toBe(400)
    expect(result.body).toEqual({
      errors: [{ message: 'page number must be below total pages' }],
      isSuccess: false,
    })
  })

  test('Getting teams succeeds without invalid queries', async () => {
    const result = await request.get('/api/teams').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: {
        teams: expect.arrayContaining([expect.objectContaining(teams[0])]),
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      },
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(totalRecords)
  })

  test('Getting teams succeeds with valid limit and page queries', async () => {
    const limit = 5
    const page = 2
    const result = await request
      .get(`/api/teams?limit=${limit}&page=${page}`)
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit,
        currentPage: page,
        totalPages: totalRecords / limit,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(limit)
  })

  test('Getting teams succeeds with valid search query', async () => {
    const result = await request.get('/api/teams?search=liverpool').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        teams: expect.arrayContaining([
          expect.objectContaining({
            name: expect.stringMatching(/liverpool/),
            owner: expect.stringMatching(/liverpool/),
            coach: expect.stringMatching(/liverpool/),
          }),
        ]),
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(1)
  })

  test('Getting teams succeeds with valid minPlayerCount query', async () => {
    const result = await request.get('/api/teams?minPlayerCount=20').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(5)
  })

  test('Getting teams succeeds with valid maxPlayerCount query', async () => {
    const result = await request.get('/api/teams?maxPlayerCount=11').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(5)
  })

  test('Getting teams succeeds with valid minMatches query', async () => {
    const result = await request.get('/api/teams?minMatches=70').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(4)
  })

  test('Getting teams succeeds with valid maxMatches query', async () => {
    const result = await request.get('/api/teams?maxMatches=40').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(4)
  })

  test('Getting teams succeeds with valid minGoals query', async () => {
    const result = await request.get('/api/teams?minGoals=40').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(7)
  })

  test('Getting teams succeeds with valid maxGoals query', async () => {
    const result = await request.get('/api/teams?maxGoals=70').send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: expect.objectContaining({
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      }),
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(7)
  })

  test('Getting teams succeeds with multiple valid queries', async () => {
    const result = await request
      .get('/api/teams?search=team&minMatches=70&maxGoals=70')
      .send()

    expect(result.statusCode).toBe(200)
    expect(result.body).toEqual({
      data: {
        teams: [
          expect.objectContaining({
            name: 'team_seven',
            matches: 70,
            goals: 70,
          }),
        ],
        limit: 10,
        currentPage: 1,
        totalPages: 1,
      },
      isSuccess: true,
    })
    expect(result.body.data.teams.length).toBe(1)
  })
})
