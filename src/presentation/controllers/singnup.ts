import { HttpRequest, HttpResponse } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { unprocessableEntity } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'
import { ServerError } from '../errors/server-error'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emaiilValidator: EmailValidator) {
    this.emailValidator = emaiilValidator
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return unprocessableEntity(new MissingParamError(field))
      }
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return unprocessableEntity(new InvalidParamError('email'))
      }
    } catch (error) {
      return { statusCode: 500, body: new ServerError() }
    }
  }
}
