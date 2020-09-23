import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
interface SutTypes {
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
  sut: DbLoadAccountByToken

}
const makeDecrypterStub = (): Decrypter => {
  class DecripterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecripterStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any name',
  email: 'any_email@mail.com',
  password: 'hashed_pass'
})
const makeLoadByAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadByAccountByTokenRepositoryStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return { decrypterStub, loadAccountByTokenRepositoryStub, sut }
}
describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct Values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decriptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decriptSpy).toBeCalledWith('any_token')
  })
  test('should return null if Decrypter return null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })
  test('should call LoadAccountByTokenRepository with correct Values', async () => {
    const { loadAccountByTokenRepositoryStub, sut } = makeSut()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadByTokenSpy).toBeCalledWith('any_value', 'any_role')
  })
})
