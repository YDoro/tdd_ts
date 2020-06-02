import { HttpRequest, HttpResponse, Controller, EmailValidator, AddAccount, Validation } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { unprocessableEntity, serverError, created } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emaiilValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emaiilValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return unprocessableEntity(error)
      }

      const { name, email, password } = httpRequest.body
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
