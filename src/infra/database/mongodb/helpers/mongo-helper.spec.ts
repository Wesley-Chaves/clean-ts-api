import env from '../../../../main/config/env'
import { MongoHelper as sut } from './mongo-helper'

beforeAll(async () => {
  await sut.connect(env.mongoUrl)
})

afterAll(async () => {
  await sut.disconnect()
})

describe('Mongo Helper', () => {
  test('Should reconnect if mongodb is down', async () => {
    let accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
    await sut.disconnect()
    accountsCollection = await sut.getCollection('accounts')
    expect(accountsCollection).toBeTruthy()
  })
})
