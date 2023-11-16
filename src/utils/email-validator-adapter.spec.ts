import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => {
  return {
    isEmail (): boolean {
      return true
    }
  }
})

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator', () => {
  test('Should return false if validator returns false', async () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = await sut.isValid('any_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', async () => {
    const sut = makeSut()
    const isValid = await sut.isValid('any_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', async () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    await sut.isValid('any_email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
