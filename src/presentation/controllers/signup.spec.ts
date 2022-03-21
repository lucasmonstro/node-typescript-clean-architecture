import faker from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import {
  CreateAccount,
  CreateAccountModel,
} from '../../domain/usecases/create-account';
import EmailValidatorAdapter from '../../utils/email-validator-adapter';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { HttpRequest } from '../protocols';
import SignUpController from './signup';
import { EmailValidator } from './signup-protocols';

type SutTypes = {
  sut: SignUpController;
  createAccountStub: CreateAccount;
  emailValidatorStub: EmailValidator;
};

class CreateAccountStub implements CreateAccount {
  async create(
    createAccountModel: Parameters<CreateAccount['create']>[0],
  ): ReturnType<CreateAccount['create']> {
    return createAccountModel;
  }
}

const makeSut = (): SutTypes => {
  const createAccountStub = new CreateAccountStub();
  const emailValidatorStub = new EmailValidatorAdapter();
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
        email: faker.internet.email(),
        password: faker.internet.password(),
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
        name: faker.name.findName(),
        password: faker.internet.password(),
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
        name: faker.name.findName(),
        email: faker.internet.email(),
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
        name: faker.name.findName(),
        email: 'invalidEmail',
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email);
  });

  it('should return ServerError when email validator throws an exception', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error('Cannot validate email');
    });
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return ServerError when createAccount usecase throws an exception', () => {
    const { sut, createAccountStub, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => true);
    jest.spyOn(createAccountStub, 'create').mockImplementationOnce(() => {
      throw new Error('Cannot create account');
    });
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('should return Created when account is created successfully', () => {
    const { sut, createAccountStub, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce(() => true);
    const createSpy = jest.spyOn(createAccountStub, 'create');
    const httpRequest: HttpRequest<CreateAccountModel> = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.CREATED);
    expect(createSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
