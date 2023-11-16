import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => {
  return {
    isEmail () {
      return true
    }
  }
})

describe('EmailValidator', () => {
  test('Should return false if validator returns false', async () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('any_email@mail.com')
    expect(isValid).toBe(false)
  })
})
