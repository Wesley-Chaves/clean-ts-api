import { AccountModel } from '../../models'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
