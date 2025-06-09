import type { User, UserEntity } from '~/domain/entities'

import type { Role } from '~/shared/role'

export interface MemberProps {
  tenantId: string
  role: Role
}

export interface UsersGateway {
  findByEmail(email: string): Promise<User | null>
  findByPhone(phone: string): Promise<User | null>
  insert(user: UserEntity, member: MemberProps): Promise<void>
}
