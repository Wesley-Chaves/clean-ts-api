import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer, TokenGenerator } from '../../protocols/criptography/'
import { LoadAccountByEmailRepository, UpdateAccessTokenRepository } from '../../protocols/repositories/'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (!account) return null

    const isValid = await this.hashComparer.compare(authentication.password, account.password)
    if (!isValid) return null

    const accessToken = await this.tokenGenerator.generate(account.id)
    await this.updateAccessTokenRepository.update(account.id, accessToken)
    return accessToken
  }
}
