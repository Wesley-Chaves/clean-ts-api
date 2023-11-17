import fg from 'fast-glob'
import { Express, Router } from 'express'

export default (app: Express): void => {
  const router = Router()

  const routeFiles = fg.sync('**/src/main/routes/**routes.ts')
  routeFiles.map(async (file) => {
    (await import(`../../../${file}`)).default(router)
  })

  app.use('/api', router)
}
