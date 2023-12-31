import { InvalidParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/emailValidator'

const makeFakeRequest = ({ name = 'any_name', email = 'any_email@mail.com', password = 'any_password', passwordConfirmation = 'any_password' }: { name?: string, email?: string, password?: string, passwordConfirmation?: string }): HttpRequest => {
  return {
    body: { name, email, password, passwordConfirmation }
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    async isValid (email: string): Promise<boolean> {
      return await new Promise((resolve) => { resolve(true) })
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if validation fails', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise((resolve) => { resolve(false) }))
    const error = await sut.validate(makeFakeRequest({}).body)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.validate(makeFakeRequest({}).body)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throws if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.validate(makeFakeRequest({}).body)
    await expect(promise).rejects.toThrow()
  })

  test('Should not return if validation pass', async () => {
    const { sut } = makeSut()
    const error = await sut.validate(makeFakeRequest({}).body)
    expect(error).toBeFalsy()
  })
})
