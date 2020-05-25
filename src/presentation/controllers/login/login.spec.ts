import { LoginController } from './login'
import { unprocessableEntity } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
interface sutTypes{
  sut: LoginController
}
const makeSut = (): sutTypes => {
  const sut = new LoginController()
  return {
    sut
  }
}
describe('Login Controller', () => {
  test('Shoud retunr 422 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity(new MissingParamError('email')))
  })
  test('Shoud retunr 422 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com.br'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity(new MissingParamError('password')))
  })
})
