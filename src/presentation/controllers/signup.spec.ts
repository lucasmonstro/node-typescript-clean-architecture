import { StatusCodes } from 'http-status-codes';
import {
  CreateAccount,
  CreateAccountModel,
} from '../../domain/usecases/create-account';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator, HttpRequest } from '../protocols';
import SignUpController from './signup';

type SutTypes = {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  emailValidatorStub: EmailValidator;
};

class CreateAccountStub implements CreateAccount {
  create(createAccountModel: CreateAccountModel) {
    return createAccountModel;
  }
}

const makeSut = (): SutTypes => {
  const createAccountStub = new CreateAccountStub();
  const emailValidatorStub = new EmailValidator();
  return {
    sut: new SignUpController(createAccountStub, emailValidatorStub),
    createAccountStub,
    emailValidatorStub,
  };
};

describe('SignUpController', () => {
  it('should return BadRequest when name is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    } as HttpRequest<CreateAccountModel>;
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return BadRequest when email is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    } as HttpRequest<CreateAccountModel>;
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return BadRequest when password is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
      },
    } as HttpRequest<CreateAccountModel>;
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return BadRequest when email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    isValidSpy.mockReturnValueOnce(false);
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should return ServerError when emailValidator throws an exception', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('Cannot validate email');
    });
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should create account', () => {
    const { sut, createAccountStub } = makeSut();
    const createSpy = jest.spyOn(createAccountStub, 'create');
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(createSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
