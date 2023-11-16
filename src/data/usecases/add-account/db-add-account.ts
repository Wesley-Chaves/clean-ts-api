import { Account } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (accountData: AddAccountModel): Promise<Account> {
    await this.encrypter.encrypt(accountData.password)
    return await new Promise((resolve) => { resolve(null) })
  }
}
