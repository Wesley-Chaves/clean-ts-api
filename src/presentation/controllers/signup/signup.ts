export class SignUpController {
  async handle (httpRequest): Promise<any> {
    return {
      statusCode: 400,
      body: new Error('Missing param: name')
    }
  }
}
