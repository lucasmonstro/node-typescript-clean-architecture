import MissingParamError from '../errors/missing-param-error';
import { HttpRequest, HttpResponse } from '../protocols/http';

export default class SignUpController {
  handle(
    httpRequest: HttpRequest<
      Partial<{ name: string; email: string; password: string }>
    >,
  ): HttpResponse<Error> {
    const nameIsNotProvided = !httpRequest.body.name;
    if (nameIsNotProvided) {
      return {
        statusCode: 400,
        body: new MissingParamError('name'),
      };
    }
    const emailIsNotProvided = !httpRequest.body.email;
    if (emailIsNotProvided) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }
    return {
      statusCode: 400,
      body: {},
    };
  }
}
