import { AccountModel } from '../../models'

export interface AddAccountModelRepository {
  name: string
  email: string
  password: string
}

export interface AddAccountRepository {
  add (accountData: AddAccountModelRepository): Promise<AccountModel>
}
