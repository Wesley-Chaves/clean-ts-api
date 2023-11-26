import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository, AddAccountModelRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../../../data/protocols/database/account/'
import { AccountModel } from '../../../../data/models'
import { Account } from '../../../../domain/entities'
import { ObjectId } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
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

  async updateAccessToken (_id: string, token: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { accessToken: token } })
  }
}
