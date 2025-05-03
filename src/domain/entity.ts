import { uuidv7 as uuid } from 'uuidv7'

export abstract class Entity<T> {
  readonly id: string
  props: T

  constructor(props: T, id?: string) {
    this.id = id ?? uuid()
    this.props = props
  }
}
