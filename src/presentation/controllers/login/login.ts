import { MissingParamError } from '../../errors'
import { badRequest, serverError, sucess, unauthorized } from '../../helpers/http-helper'
import { Validation } from '../signup/signup-protocols'
import { Authentication, Controller, HttpRequest, HttpResponse }
  from './login-protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.authentication = authentication
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }

      return sucess({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
