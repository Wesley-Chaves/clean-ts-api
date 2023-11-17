import { Request, Response } from 'express'
import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  test('Should return default content type as json', async () => {
    app.get('/content_type_as_json', (req: Request, res: Response) => {
      res.send('')
    })
    await request(app)
      .get('/content_type_as_json')
      .expect('content-type', /json/)
  })

  test('Should return xml content type when forced', async () => {
    app.get('/content_type_as_xml', (req: Request, res: Response) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/content_type_as_xml')
      .expect('content-type', /xml/)
  })
})
