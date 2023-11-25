import { Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { Account } from '../../../domain/entities/account'
import { AddAccountModel, AddAccount } from '../../../domain/usecases/add-account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<Account> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
