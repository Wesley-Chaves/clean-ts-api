export interface AddAccountModelRepository {
  name: string
  email: string
  password: string
}

export interface AccountRepository {
  id: string
  name: string
  email: string
  password: string
}

export interface AddAccountRepository {
  add (accountData: AddAccountModelRepository): Promise<AccountRepository>
}
