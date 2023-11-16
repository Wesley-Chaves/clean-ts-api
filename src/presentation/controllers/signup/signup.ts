import { EmailValidator } from '../../protocols/emailValidator'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { AddAccount } from '../../../domain/usecases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFilds) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValid = await this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      await this.addAccount.add({ name, email, password })
    } catch (error) {
      return serverError()
    }
  }
}
