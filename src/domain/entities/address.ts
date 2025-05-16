import { Entity } from '~/domain/entity'
import type { Zip } from '~/domain/types'
import type { Replace } from '~/domain/replace'

export interface AddressProps {
  zip: Zip
  place: string
  number: string
  complement?: string | null
  district: string
  city: string
  state: string
}

export interface AddressEntity extends Replace<AddressProps, { zip: string }> {
  id: string
}

export class Address extends Entity<AddressProps> {
  private constructor(props: AddressProps, id?: string) {
    super(props, id)
  }

  static instance(props: AddressProps, id?: string) {
    return new Address({ ...props }, id)
  }

  value(): AddressEntity {
    return {
      id: this.id,
      ...this.props,
      zip: this.props.zip.value(),
    }
  }

  formated(): AddressEntity {
    return {
      id: this.id,
      ...this.props,
      zip: this.props.zip.formated(),
    }
  }
}
