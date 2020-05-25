import { LoginController } from './login'
import { unprocessableEntity } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors'
describe('Login Controller', () => {
  test('Shoud retunr 422 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = {
      body: {
        password: 'any'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(unprocessableEntity(new MissingParamError('email')))
  })
})
