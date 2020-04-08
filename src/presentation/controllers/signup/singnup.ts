import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { unprocessableEntity, serverError } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emaiilValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emaiilValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return unprocessableEntity(new MissingParamError(field))
      }
      const { name, email, password, passwordConfirm } = httpRequest.body
      if (password !== passwordConfirm) {
        return unprocessableEntity(new InvalidParamError('passwordConfirm'))
      }
      if (!this.emailValidator.isValid(email)) {
        return unprocessableEntity(new InvalidParamError('email'))
      }
      this.addAccount.add({
        name,
        email,
        password
      })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
