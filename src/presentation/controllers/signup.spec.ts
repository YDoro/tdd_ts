import { SignUpController } from './singnup'

describe('SignUp Controller', () => {
  test('Should return 422 if no name is provided', () => {
    // sut = system under test, the class that will be tested
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  })
  test('Should return 422 if no email is provided', () => {
    // sut = system under test, the class that will be tested
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new Error('Missing param: email'))
  })
})
