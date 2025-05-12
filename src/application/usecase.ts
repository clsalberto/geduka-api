import type { NotificationData } from '~/shared/notification'

export interface Usecase<I, O> {
  execute(data: I, db?: unknown): Promise<NotificationData<O>>
}
