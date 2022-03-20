import faker from '@faker-js/faker';
import isEmail from 'validator/lib/isEmail';
import { EmailValidator } from '../presentation/controllers/signup-protocols';
import EmailValidatorAdapter from './email-validator-adapter';

jest.mock('validator/lib/isEmail');

const makeSut = (): EmailValidator => new EmailValidatorAdapter();
const mockedIsEmail = isEmail as jest.MockedFunction<typeof isEmail>;

describe('EmailValidatorAdapter', () => {
  it('should return false when email is invalid', () => {
    mockedIsEmail.mockReturnValue(false);
    const sut = makeSut();
    const invalidEmail = 'invalid_email';
    expect(sut.isValid(invalidEmail)).toBe(false);
    expect(mockedIsEmail).toHaveBeenCalledWith(invalidEmail);
  });

  it('should return truen when email is valid', () => {
    mockedIsEmail.mockReturnValue(true);
    const sut = makeSut();
    const validEmail = faker.internet.email();
    expect(sut.isValid(validEmail)).toBe(true);
    expect(mockedIsEmail).toHaveBeenCalledWith(validEmail);
  });
});
