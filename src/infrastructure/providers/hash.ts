import { compare, hash } from 'bcryptjs'

import type { HashAdapter } from '~/application/adapters/hash'

export class BcryptHashProvider implements HashAdapter {
  async hash(payload: string): Promise<string> {
    return await hash(payload, 10)
  }

  async compare(payload: string, hashed: string): Promise<boolean> {
    return await compare(payload, hashed)
  }
}
