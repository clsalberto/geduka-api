import { Entity } from '~/domain/entity'
import type { Replace } from '~/domain/replace'
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
      zip: this.props.zip.value(),
      place: this.props.place,
      number: this.props.number,
      complement: this.props.complement,
      district: this.props.district,
      city: this.props.city,
      state: this.props.state,
    }
  }

  formated(): AddressEntity {
    return {
      id: this.id,
      zip: this.props.zip.formated(),
      place: this.props.place,
      number: this.props.number,
      complement: this.props.complement,
      district: this.props.district,
      city: this.props.city,
      state: this.props.state,
    }
  }
}
