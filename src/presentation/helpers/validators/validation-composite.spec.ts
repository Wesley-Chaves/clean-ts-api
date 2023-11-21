import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { Validation } from './validation'
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

const makeSut = (): any => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise((resolve) => { resolve(new MissingParamError('field')) }))
    const error = await sut.validate(makeFakeRequest().body)
    expect(error).toEqual(new MissingParamError('field'))
  })
})
