import { Router } from 'express'
import { makeSignUpController } from '../factories/signup/signup'
import { routeAdapter } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(makeSignUpController()))
}
