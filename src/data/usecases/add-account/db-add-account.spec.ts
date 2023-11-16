import { AccountRepository, AddAccountModelRepository, AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

const accountData = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise((resolve) => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModelRepository): Promise<AccountRepository> {
      return await new Promise((resolve) => {
        resolve({
          id: 'valid_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        })
      })
    }
  }

  const encrypterStub = makeEncrypterStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith(Object.assign({}, accountData, { password: 'hashed_password' }))
  })
})
