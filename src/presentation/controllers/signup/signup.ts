import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, serverError, sucess } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValid = await this.emailValidator.isValid(email)
      if (!isValid) return badRequest(new InvalidParamError('email'))

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const account = await this.addAccount.add({ name, email, password })
      return sucess(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
