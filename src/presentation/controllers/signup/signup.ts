import { Controller } from '../../protocols/controller'
import { EmailValidator } from '../../protocols/emailValidator'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFilds) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }

    const { email } = httpRequest.body
    const isValid = await this.emailValidator.isValid(email)
    if (!isValid) return badRequest(new Error('Invalid param: email'))
  }
}
