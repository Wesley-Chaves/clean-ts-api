import { MongoHelper } from '../helpers/mongo-helper'
import { AccountRepository, AddAccountModelRepository, AddAccountRepository } from '../../../../data/protocols/add-account-repository'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModelRepository): Promise<AccountRepository> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const result = await accountsCollection.insertOne(accountData)
    const findResult = await accountsCollection.findOne({ _id: result.insertedId })
    return MongoHelper.map(findResult)
  }
}
