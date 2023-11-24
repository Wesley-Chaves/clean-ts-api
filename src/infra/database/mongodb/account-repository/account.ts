import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository, AddAccountModelRepository } from '../../../../data/protocols/repositories/add-account'
import { AccountModel } from '../../../../data/models'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModelRepository): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    const findResult = await accountsCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(findResult)
  }
}
