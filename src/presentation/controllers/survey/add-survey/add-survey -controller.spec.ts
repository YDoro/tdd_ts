import { HttpRequest } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { Validation } from '../../../protocols'

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
describe('AddSurveyController', () => {
  test('should call validation with correct values', async () => {
    class ValidationsStub implements Validation {
      validate (input: any): Error {
        return null
      }
    }
    const validationsStub = new ValidationsStub()
    const validateSpy = jest.spyOn(validationsStub, 'validate')
    const sut = new AddSurveyController(validationsStub)
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toBeCalledWith(httpRequest.body)
  })
})
