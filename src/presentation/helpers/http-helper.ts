import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors'

export const Created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
export const unprocessableEntity = (error: Error): HttpResponse => ({
  statusCode: 422,
  body: error
})
export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
