import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { MissingParamError } from '../../errors'
import { unprocessableEntity } from '../../helpers/http-helper'

export class LoginController implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return await new Promise(resolve => resolve(unprocessableEntity(new MissingParamError('email'))))
  }
}
