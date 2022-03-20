import {
  CreateAccount,
  CreateAccountModel,
} from '../../domain/usecases/create-account';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { badRequest, created, serverError } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols';
import { EmailValidator } from './signup-protocols';

export default class SignUpController {
  constructor(
    private createAccount: CreateAccount,
    private emailValidator: EmailValidator,
  ) {}

  handle(
    httpRequest: HttpRequest<CreateAccountModel>,
  ): HttpResponse<Error | unknown | ServerError> {
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
      this.createAccount.create(httpRequest.body);
      return created();
    } catch (error) {
      return serverError();
    }
  }
}
