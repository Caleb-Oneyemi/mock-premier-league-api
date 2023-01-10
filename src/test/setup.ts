import mongoose from 'mongoose'
import { testRedis } from './redis'

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL!)
})

afterAll(async () => {
  await mongoose.disconnect()
})

afterEach(async () => {
  jest.clearAllMocks()

  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }

  await testRedis.flushall()
})

jest.mock('../common/redisClient', () => {
  return {
    client: testRedis,
  }
})
