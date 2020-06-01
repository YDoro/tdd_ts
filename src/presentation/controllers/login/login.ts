import { Controller, HttpResponse, HttpRequest, Authentication, EmailValidator } from './login-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { unprocessableEntity, serverError, unauthorized, ok } from '../../helpers/http-helper'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication
  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return unprocessableEntity(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isVaild = this.emailValidator.isValid(email)
      if (!isVaild) {
        return unprocessableEntity(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
