import MissingParamError from '../errors/missing-param-error';
import SignUpController from './signup';

describe('SignUpController', () => {
  test('Should return BadRequest when name is not provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return BadRequest when no email is not provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
});
