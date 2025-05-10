import { Address } from '~/domain/entities'
import { Zip } from '~/domain/types'
import { NotificationData } from '~/domain/notification'

import type { AddressesGateway } from '~/application/gateways'
import type { Usecase } from '../usecase'

import { HttpCode } from '~/shared/http'

export interface CreateAddressInput {
  zip: string
  place: string
  number: string
  complement?: string | null
  district: string
  city: string
  state: string
}

export interface CreateAddressInterface
  extends Usecase<CreateAddressInput, NotificationData<Address>> {}

export class CreateAddressUsecase implements CreateAddressInterface {
  constructor(private readonly address: AddressesGateway) {}

  async execute(data: CreateAddressInput): Promise<NotificationData<Address>> {
    let address = await this.address.findByLocationProps({ ...data })

    if (!address) {
      address = Address.instance({ ...data, zip: Zip.create(data.zip) })
      await this.address.insert(address)
    }

    return new NotificationData(
      { message: 'Get address successfully', code: HttpCode.OK },
      address
    )
  }
}
