import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import { MissingParamError, InvalidParamError } from '../errors'
import { unprocessableEntity, serverError } from '../helpers/http-helper'

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
      if (httpRequest.body.password !== httpRequest.body.passwordConfirm) {
        return unprocessableEntity(new InvalidParamError('passwordConfirm'))
      }
      if (!this.emailValidator.isValid(httpRequest.body.email)) {
        return unprocessableEntity(new InvalidParamError('email'))
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
