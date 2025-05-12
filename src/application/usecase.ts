import type { NotificationData } from '~/domain/notification'

export interface Usecase<I, O> {
  execute(data: I, db?: unknown): Promise<NotificationData<O>>
}
