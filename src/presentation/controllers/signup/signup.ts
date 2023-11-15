import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: any

  constructor (emailValidator: any) {
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
