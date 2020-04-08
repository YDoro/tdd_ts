import { SignUpController } from './singnup'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator, AccountModel, AddAccount, AddAccountModel } from './signup-protocols'

interface SutTypes{
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_pass'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
  test('Should return 422 if passwords don`t match', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'other_pass'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(422)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'))
  })
  test('Should return 422 if no passwordConfirm is provided', () => {
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
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
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
  test('Should call AddAccout with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_pass',
        passwordConfirm: 'any_pass'
      }
    }
    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: httpRequest.body.name,
      email: httpRequest.body.email,
      password: httpRequest.body.password

    })
  })
})
