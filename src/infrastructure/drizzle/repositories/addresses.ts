import { and, eq } from 'drizzle-orm'

import { Address } from '~/domain/entities'
import { Zip } from '~/domain/types'

import type {
  AddressesGateway,
  LocationProps,
} from '~/application/gateways/addresses'

import type { Transaction } from '~/infrastructure/drizzle/client'
import { addresses } from '~/infrastructure/drizzle/schema/addresses'

export class AddressesRepository implements AddressesGateway {
  constructor(private readonly ctx: Transaction) {}

  async findByLocationProps(location: LocationProps): Promise<Address | null> {
    const data = location.complement
      ? await this.ctx.query.addresses.findFirst({
          where: and(
            eq(addresses.zip, location.zip),
            eq(addresses.place, location.place),
            eq(addresses.number, location.number),
            eq(addresses.complement, location.complement),
            eq(addresses.district, location.district)
          ),
        })
      : await this.ctx.query.addresses.findFirst({
          where: and(
            eq(addresses.zip, location.zip),
            eq(addresses.place, location.place),
            eq(addresses.number, location.number),
            eq(addresses.district, location.district)
          ),
        })

    if (!data) return null

    return Address.instance(
      {
        ...data,
        zip: Zip.create(data.zip),
      },
      data.id
    )
  }

  async insert(address: Address): Promise<void> {
    await this.ctx.insert(addresses).values({
      ...address.props,
      id: address.id,
      zip: address.props.zip.value(),
    })
  }
}
