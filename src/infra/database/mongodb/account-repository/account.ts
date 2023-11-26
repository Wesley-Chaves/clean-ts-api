import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository, AddAccountModelRepository, LoadAccountByEmailRepository } from '../../../../data/protocols/repositories/'
import { AccountModel } from '../../../../data/models'
import { Account } from '../../../../domain/entities'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async add (accountData: AddAccountModelRepository): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    const findResult = await accountsCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(findResult)
  }

  async loadByEmail (email: string): Promise<Account> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })
    return MongoHelper.map(account)
  }
}
