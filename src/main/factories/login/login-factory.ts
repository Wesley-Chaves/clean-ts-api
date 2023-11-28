import env from '../../config/env'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { DbAuthenticationService } from '../../../data/services/authentication/db-authentication-service'
import { LogMongoRepository } from '../../../infra/database/mongodb/log/log-mongo-repository'
import { AccountMongoRepository } from '../../../infra/database/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'

export const makeLoginController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAuthenticationService = new DbAuthenticationService(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
  const logMongoRepository = new LogMongoRepository()
  const loginController = new LoginController(dbAuthenticationService, makeLoginValidation())
  return new LogControllerDecorator(loginController, logMongoRepository)
}
