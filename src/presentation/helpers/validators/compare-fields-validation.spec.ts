import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('CompareFields Validation', () => {
  test('Should return InvalidParamError if validation fails', async () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')
    const error = await sut.validate({ password: 'valid_password', passwordConfirmation: 'invalid_confirmation' })
    expect(error).toEqual(new InvalidParamError('passwordConfirmation'))
  })
})
