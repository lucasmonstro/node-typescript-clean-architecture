import MissingParamError from '../errors/missing-param-error';
import InvalidParamError from '../errors/invalid-param-error';
import { badRequest, serverError } from '../helpers/http-helpers';
import EmailValidator from '../protocols/email-validator';
import { HttpRequest, HttpResponse } from '../protocols/http';

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
        const isFieldMissing = !httpRequest.body[field];
        if (isFieldMissing) {
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
