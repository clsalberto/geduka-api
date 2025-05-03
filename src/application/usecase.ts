export interface Usecase<I, O> {
  execute(data: I, db: unknown): Promise<O>
}
