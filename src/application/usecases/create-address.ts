import { Address } from '~/domain/entities'
import { Zip } from '~/domain/types'

import type { AddressesGateway } from '../gateways/addresses'
import type { Usecase } from '../usecase'

export interface CreateAddressInput {
  zip: string
  place: string
  number: string
  complement?: string | null
  district: string
  city: string
  state: string
}

export interface CreateAddressOutput {
  address: Address
}

export interface CreateAddressInterface
  extends Usecase<CreateAddressInput, CreateAddressOutput> {}

export class CreateAddressUsecase implements CreateAddressInterface {
  constructor(private readonly address: AddressesGateway) {}

  async execute(
    data: CreateAddressInput,
    db: unknown
  ): Promise<CreateAddressOutput> {
    let address = await this.address.findByLocationProps({ ...data })

    if (!address) {
      address = Address.instance({ ...data, zip: Zip.create(data.zip) })
      await this.address.insert(address)
    }

    return { address }
  }
}
