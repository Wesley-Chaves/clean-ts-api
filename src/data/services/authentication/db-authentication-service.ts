import { LoadAccountByEmailRepository, UpdateAccessTokenRepository, Encrypter, HashComparer } from './db-authentication-service-protocols'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'

export class DbAuthenticationService implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (!account) return null

    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return null

    const accessToken = await this.encrypter.encrypt(account.id)
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)
    return accessToken
  }
}
