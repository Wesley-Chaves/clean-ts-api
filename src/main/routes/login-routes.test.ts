import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'

describe('Login Routes', () => {
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

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Wesley Chaves',
          email: 'wesleychavesdev@hotmail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })
})