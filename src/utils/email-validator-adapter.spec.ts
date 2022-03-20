import faker from '@faker-js/faker';
import isEmail from 'validator/lib/isEmail';
import EmailValidatorAdapter from './email-validator-adapter';

jest.mock('validator/lib/isEmail');

describe('EmailValidatorAdapter', () => {
  const mockedIsEmail = isEmail as jest.MockedFunction<typeof isEmail>;

  it('should return false when email is invalid', () => {
    mockedIsEmail.mockReturnValue(false);
    const sut = new EmailValidatorAdapter();
    const invalidEmail = 'invalid_email';
    expect(sut.isValid(invalidEmail)).toBe(false);
    expect(mockedIsEmail).toHaveBeenCalledWith(invalidEmail);
  });

  it('should return truen when email is valid', () => {
    mockedIsEmail.mockReturnValue(true);
    const sut = new EmailValidatorAdapter();
    const validEmail = faker.internet.email();
    expect(sut.isValid(validEmail)).toBe(true);
    expect(mockedIsEmail).toHaveBeenCalledWith(validEmail);
  });
});
