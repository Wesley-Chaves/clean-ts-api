import { Collection } from 'mongodb'
import { MongoHelper } from '../../infra/database/mongodb/helpers/mongo-helper'
import app from '../config/app'
import request from 'supertest'
import { hash } from 'bcrypt'

let accountsCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect('mongodb://localhost:27017')
  })

  beforeEach(async () => {
    accountsCollection = await MongoHelper.getCollection('accounts')
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

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const salt = 12
      const password = await hash('123', salt)
      await accountsCollection.insertOne({
        name: 'Wesley Chaves',
        email: 'wesleychavesdev@hotmail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'wesleychavesdev@hotmail.com',
          password: '123'
        })
        .expect(200)
    })
  })
})
