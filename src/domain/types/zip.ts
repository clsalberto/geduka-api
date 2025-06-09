import { HttpCode } from '~/shared/http'
import { NotificationError } from '~/shared/notification'
import { validateZip } from '~/shared/utils/validation'

export class Zip {
  private zip: string

  private constructor(zip: string) {
    this.validate(zip)
    this.zip = zip
  }

  private validate(zip: string) {
    const { error, message } = validateZip(zip)

    if (error)
      throw new NotificationError({
        message,
        code: HttpCode.FORBIDDEN,
      })
  }

  static create(zip: string) {
    return new Zip(zip)
  }

  value() {
    return this.zip.replace(/\D/g, '')
  }

  formated() {
    return this.zip.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
  }
}
