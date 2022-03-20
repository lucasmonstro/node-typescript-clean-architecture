import isEmail from 'validator/lib/isEmail';
import EmailValidatorAdapter from './email-validator-adapter';

jest.mock('validator/lib/isEmail');

describe('EmailValidatorAdapter', () => {
  const mockedIsEmail = isEmail as jest.MockedFunction<typeof isEmail>;

  it('should return false when email is invalid', () => {
    mockedIsEmail.mockReturnValue(false);
    const sut = new EmailValidatorAdapter();
    expect(sut.isValid('invalid_email')).toBe(false);
  });

  it('should return truen when email is valid', () => {
    mockedIsEmail.mockReturnValue(true);
    const sut = new EmailValidatorAdapter();
    expect(sut.isValid('valid_email@email.com')).toBe(true);
  });
});
