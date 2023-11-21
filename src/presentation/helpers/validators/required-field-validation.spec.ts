import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', async () => {
    const sut = new RequiredFieldValidation('name')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const error = await sut.validate(httpRequest.body)
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should not return if validation pass', async () => {
    const sut = new RequiredFieldValidation('name')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const error = await sut.validate(httpRequest.body)
    expect(error).toBeFalsy()
  })
})
