import type { User } from '~/domain/entities'

import type { Role } from '~/shared/role'

export interface MemberProps {
  tenantId: string
  role: Role
}

export interface ContactProps {
  email: string
  phone: string
}

export interface UsersGateway {
  findByContactProps(contact: ContactProps): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByPhone(phone: string): Promise<User | null>
  insert(user: User, member: MemberProps): Promise<void>
}
