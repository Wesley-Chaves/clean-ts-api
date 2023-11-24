import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeSut = (): SutTypes => {
  const validationStubs = [
    makeValidation(),
    makeValidation()
  ]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Promise((resolve) => { resolve(new MissingParamError('field')) }))
    const error = await sut.validate(makeFakeRequest().body)
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Promise((resolve) => { resolve(new Error()) }))
    jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new Promise((resolve) => { resolve(new MissingParamError('field')) }))
    const error = await sut.validate(makeFakeRequest().body)
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation pass', async () => {
    const { sut } = makeSut()
    const error = await sut.validate(makeFakeRequest().body)
    expect(error).toBeFalsy()
  })
})
