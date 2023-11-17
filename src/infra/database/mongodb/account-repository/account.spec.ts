import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

beforeAll(async () => {
  await MongoHelper.connect('mongodb://localhost:27017')
})

beforeEach(async () => {
  const accountsCollection = await MongoHelper.getCollection('accounts')
  await accountsCollection.deleteMany({})
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongo Repository', () => {
  test('Should return an account on sucess', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })
})