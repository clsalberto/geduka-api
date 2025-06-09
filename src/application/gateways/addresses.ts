import type { Address, AddressEntity } from '~/domain/entities'

export interface LocationProps {
  zip: string
  place: string
  number: string
  complement?: string | null
  district: string
}

export interface AddressesGateway {
  findByLocationProps(location: LocationProps): Promise<Address | null>
  insert(address: AddressEntity): Promise<void>
}
