import { env } from '~/infrastructure/env'

import { buildServer, logger } from '~/presentation'

async function gracefulShutdown({
  app,
}: { app: Awaited<ReturnType<typeof buildServer>> }) {
  await app.close()
}

async function main() {
  const app = await buildServer()

  await app.listen({ host: env.HOST, port: env.PORT })

  const signals = ['SIGINT', 'SIGTERM']

  logger.debug(env, 'Using Enviroment Variable')

  for (const signal of signals) {
    process.on(signal, () => {
      gracefulShutdown({ app })
    })
  }
}

main()
