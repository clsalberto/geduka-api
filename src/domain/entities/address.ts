import { Entity } from '~/domain/entity'
import type { Zip } from '~/domain/types'

export interface AddressProps {
  zip: Zip
  place: string
  number: string
  complement?: string | null
  district: string
  city: string
  state: string
}

export class Address extends Entity<AddressProps> {
  private constructor(props: AddressProps, id?: string) {
    super(props, id)
  }

  static instance(props: AddressProps, id?: string) {
    return new Address({ ...props }, id)
  }
}
