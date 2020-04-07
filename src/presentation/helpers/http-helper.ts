import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors/server-error'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})
export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
