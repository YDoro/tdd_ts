import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { unprocessableEntity, serverError, created } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emaiilValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emaiilValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return created(account)
    } catch (error) {
      console.error(error)
      return serverError(error)
    }
  }
}
