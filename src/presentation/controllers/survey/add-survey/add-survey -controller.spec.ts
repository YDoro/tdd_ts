import { HttpRequest, AddSurvey, AddSurveyModel } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'
import { badRequest } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
}
)

interface SutTypes{
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}
const makeValidationStub = (): ValidationStub => new ValidationStub()
const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

const makeSut = (): SutTypes => {
  const addSurveyStub = makeAddSurvey()
  const validationStub = makeValidationStub()
  const sut = new AddSurveyController(validationStub, addSurveyStub)
  return { sut, validationStub, addSurveyStub }
}
describe('AddSurveyController', () => {
  test('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
  test('should return 400 if Valdiation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error(''))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('')))
  })
  test('should call addSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toBeCalledWith(httpRequest.body)
  })
})
