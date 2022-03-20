import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError } from '../helpers/http-helpers';
import { EmailValidator, HttpRequest, HttpResponse } from '../protocols';

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

export default class SignUpController {
  constructor(private emailValidator: EmailValidator) {}

  handle(
    httpRequest: HttpRequest<Partial<SignUpPayload>>,
  ): HttpResponse<Error> {
    try {
      const requiredFields = ['name', 'email', 'password'];
      for (const field of requiredFields) {
        const missingField = !httpRequest.body[field];
        if (missingField) {
          return badRequest(new MissingParamError(field));
        }
      }
      const invalidEmail = !this.emailValidator.isValid(httpRequest.body.email);
      if (invalidEmail) {
        return badRequest(new InvalidParamError('email'));
      }
    } catch (error) {
      return serverError();
    }
  }
}
