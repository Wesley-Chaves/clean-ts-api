import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const generatedError = new Error()
generatedError.stack = 'any_stack'

const makeSut = (): LogMongoRepository => {
  return new LogMongoRepository()
}

describe('Log Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017/clean-node-api')
  })

  beforeEach(async () => {
    const errorsCollection = await MongoHelper.getCollection('errors')
    await errorsCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MongoHelper.client = null
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError(generatedError.stack)
    const errorsCollection = await MongoHelper.getCollection('errors')
    const count = await errorsCollection.countDocuments()
    expect(count).toBe(1)
  })
})
