import { Controller, HttpResponse, HttpRequest } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { unprocessableEntity, serverError } from '../../helpers/http-helper'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return await new Promise(resolve => resolve(unprocessableEntity(new MissingParamError('email'))))
      }
      if (!password) {
        return await new Promise(resolve => resolve(unprocessableEntity(new MissingParamError('password'))))
      }
      const isVaild = this.emailValidator.isValid(email)
      if (!isVaild) {
        return await new Promise(resolve => resolve(unprocessableEntity(new InvalidParamError('email'))))
      }
    } catch (error) {
      return serverError(error)
    }
  }
}
