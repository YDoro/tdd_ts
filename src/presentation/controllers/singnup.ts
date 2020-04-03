export class SignUpController {
  handle (httpRequest: any): any {
    return {
      statusCode: 422,
      body: new Error('Missing param: name')
    }
  }
}
