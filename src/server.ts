import { env } from '~/infrastructure/env'
import { app } from '~/presentation'

app.listen({ port: env.PORT }).then(() => {
  console.info('Server running...')
})
