import MissingParamError from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols/http';

export default class SignUpController {
  handle(
    httpRequest: HttpRequest<
      Partial<{ name: string; email: string; password: string }>
    >,
  ): HttpResponse<Error> {
    const requiredFields = ['name', 'email', 'password'];
    for (const field of requiredFields) {
      const isFieldMissing = !httpRequest.body[field];
      if (isFieldMissing) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
