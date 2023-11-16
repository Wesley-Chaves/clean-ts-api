import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/emailValidator'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFilds) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { email } = httpRequest.body
      const isValid = await this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))
    } catch (error) {
      return serverError()
    }
  }
}
