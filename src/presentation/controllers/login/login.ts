import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { MissingParamError } from '../../errors'
import { unprocessableEntity } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body.email) {
      return await new Promise(resolve => resolve(unprocessableEntity(new MissingParamError('email'))))
    }
    if (!httpRequest.body.password) {
      return await new Promise(resolve => resolve(unprocessableEntity(new MissingParamError('password'))))
    }
    this.emailValidator.isValid(httpRequest.body.email)
  }
}
