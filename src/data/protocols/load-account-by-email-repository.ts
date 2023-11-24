import { Account } from '../models/account'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<Account>
}
