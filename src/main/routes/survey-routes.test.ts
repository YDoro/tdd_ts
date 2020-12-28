import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let surveyCollection: Collection
let accountCollection: Collection
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  describe('POST /surveys', () => {
    test('Should return status 403 on add survey without accessToken', async () => {
      await request(app).post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'Answer 1',
            image: 'http://imagename.domain.com'
          }, {
            answer: 'Answer 2'
          }]
        })
        .expect(403)
    })
    // test('should return 204 on add survey with valid token', async () => {
    //   const res = await accountCollection.insertOne({
    //     name: 'yan',
    //     password: '123',
    //     email: 'some_email@mail.com',
    //     role: 'admin'
    //   })
    //   const id = res.ops[0]._id
    //   const accessToken = sign({ id }, env.jwtSecret)
    //   await accountCollection.updateOne({
    //     _id: id
    //   }, {
    //     $set: {
    //       accessToken
    //     }
    //   })
    //   await request(app).post('/api/surveys')
    //     .send({
    //       question: 'Question',
    //       answers: [{
    //         answer: 'Answer 1',
    //         image: 'http://imagename.domain.com'
    //       }, {
    //         answer: 'Answer 2'
    //       }]
    //     })
    //     .set('x-access-token', accessToken)
    //     .expect(204)
    // })
  })
})
