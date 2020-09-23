import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'
interface SutTypes {
  decrypterStub: Decrypter
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
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return { decrypterStub, sut }
}
describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct Values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decriptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decriptSpy).toBeCalledWith('any_token')
  })
})
