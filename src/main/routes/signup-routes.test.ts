import app from '../config/app'
import request from 'supertest'

describe('', () => {
  test('', async () => {
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
