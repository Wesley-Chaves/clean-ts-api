import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/emailValidator'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  async validate (input: any): Promise<Error> {
    const isValid = await this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
