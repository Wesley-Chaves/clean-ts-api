import { MissingParamError } from './src/presentation/errors'
import { RequiredFieldValidation } from './src/presentation/helpers/validators/required-field-validation'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', async () => {
    const sut = new RequiredFieldValidation('name')
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const error = await sut.validate(httpRequest.body)
    expect(error).toEqual(new MissingParamError('name'))
  })

  test('Should not return if validation succeeds', async () => {
    const sut = new RequiredFieldValidation('name')
    const httpRequest = {
      body: {
        name: 'any_name'
      }
    }
    const error = sut.validate(httpRequest.body)
    expect(error).toBeFalsy()
  })
})
