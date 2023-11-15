import { Controller } from '../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'

export class SignUpController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFilds = ['name', 'email', 'password']
    for (const field of requiredFilds) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
    }
  }
}
