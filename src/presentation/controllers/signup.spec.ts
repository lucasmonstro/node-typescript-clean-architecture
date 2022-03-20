import { StatusCodes } from 'http-status-codes';
import InvalidParamError from '../errors/invalid-param-error';
import MissingParamError from '../errors/missing-param-error';
import EmailValidator from '../protocols/email-validator';
import SignUpController from './signup';

type SutTypes = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidator();
  return {
    sut: new SignUpController(emailValidatorStub),
    emailValidatorStub,
  };
};

describe('SignUpController', () => {
  it('Should return BadRequest when name is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return BadRequest when email is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return BadRequest when password is not provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return BadRequest when email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
});
