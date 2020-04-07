import { SignUpController } from './singnup'
import { MissingParamError } from '../errors/missing-param-error'
import { InvalidParamError } from '../errors/invalid-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { ServerError } from '../errors/server-error'

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}
describe('SignUp Controller', () => {
  test('Should return 422 if no name is provided', () => {
    // sut = system under test, the class that will be tested
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
  test('Should return 422 if no email is provided', () => {
    // sut = system under test, the class that will be tested
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
  test('Should return 422 if no password is provided', () => {
    // sut = system under test, the class that will be tested
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })
  test('Should return 422 if no passwordConfirm is provided', () => {
    // sut = system under test, the class that will be tested
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'))
  })
  test('Should return 422 if no an invalid email is provided', () => {
    // sut = system under test, the class that will be tested
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })
  test('Should call email vailidator with the correct email', () => {
    // sut = system under test, the class that will be tested
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email')
  })
  test('Should return 500 if email validator throws', () => {
    // sut = system under test, the class that will be tested
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
