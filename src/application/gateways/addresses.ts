import type { Address } from '~/domain/entities'

export interface LocationProps {
  zip: string
  place: string
  number: string
  complement?: string | null
  district: string
}

export interface AddressesGateway {
  findByLocationProps(location: LocationProps): Promise<Address | null>
  insert(address: Address): Promise<void>
}
