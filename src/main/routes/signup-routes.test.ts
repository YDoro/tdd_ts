import request from 'supertest'
import app from '../config/app'
describe('SignUp Routes', () => {
  test('Should retunr an account on success', async () => {
    await request(app).post('/api/signup')
      .send({
        name: 'yan',
        password: 'some_password',
        passwordConfirmation: 'some_password',
        email: 'some_email@mail.com'
      })
      .expect(200)
  })
})
