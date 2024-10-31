export type HttpCode = 200 | 201 | 400 | 401 | 402 | 404 | 409 | 500

export const HttpCode = {
  SUCCESS: 200 as HttpCode,
  CREATED: 201 as HttpCode,
  BAD_REQUEST: 400 as HttpCode,
  UNAUTHORIZED: 401 as HttpCode,
  PAYMENT_REQUIRED: 402 as HttpCode,
  NOT_FOUND: 404 as HttpCode,
  CONFLICT: 409 as HttpCode,
  INTERNAL_SERVER: 500 as HttpCode,
}
