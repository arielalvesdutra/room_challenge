export default class FakeResponse {
  statusCode: number = 200
  body: any = {}

  send(data: any) {
    this.body = data
    return this
  }

  status(code: number) {
    this.statusCode = code
    return this
  }
}
