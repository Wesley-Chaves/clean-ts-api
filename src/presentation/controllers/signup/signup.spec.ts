import { SignUpController } from './signup'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
import { HttpRequest, AddAccountModel, Account, AddAccount, Validation }
  from './signup-protocols'

const makeFakeRequest = ({ name = 'any_name', email = 'any_email@mail.com', password = 'any_password', passwordConfirmation = 'any_password' }: { name?: string, email?: string, password?: string, passwordConfirmation?: string }): HttpRequest => {
  return {
    body: { name, email, password, passwordConfirmation }
  }
}

const generetedError = new Error()
generetedError.stack = 'any_stack'

const fakeAccount = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (accountData: AddAccountModel): Promise<Account> {
      return await new Promise((resolve) => { resolve(fakeAccount) })
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)
  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest({}))
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => {
      reject(new Error())
    }))
    const httpResponse = await sut.handle(makeFakeRequest({}))
    expect(httpResponse).toEqual(serverError(generetedError))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest({}))
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(fakeAccount)
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest({})
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise((resolve) => { resolve(new MissingParamError('any_field')) }))
    const httpResponse = await sut.handle(makeFakeRequest({}))
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
