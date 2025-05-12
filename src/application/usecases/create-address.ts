import { Address } from '~/domain/entities'
import { Zip } from '~/domain/types'

import type { AddressesGateway } from '~/application/gateways'
import type { Usecase } from '~/application/usecase'

import { HttpCode } from '~/shared/http'
import { NotificationData } from '~/shared/notification'

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
    data: CreateAddressInput
  ): Promise<NotificationData<CreateAddressOutput>> {
    let address = await this.address.findByLocationProps({
      zip: data.zip,
      place: data.place,
      number: data.number,
      complement: data.complement,
      district: data.district,
    })

    if (!address) {
      address = Address.instance({ ...data, zip: Zip.create(data.zip) })
      await this.address.insert(address)
    }

    return new NotificationData(
      { message: 'Get address successfully', code: HttpCode.OK },
      { address }
    )
  }
}
