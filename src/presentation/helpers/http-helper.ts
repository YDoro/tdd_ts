import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const Created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
export const ok = (data?: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})
export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})
export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
