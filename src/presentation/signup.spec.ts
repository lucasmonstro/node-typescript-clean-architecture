import SignUpController from './signup';

describe('SignUpController', () => {
  test('Should return BadRequest when no name is provided', () => {
    const sut = new SignUpController();
    const httpResponse = sut.handle();
    expect(httpResponse.statusCode).toBe(400);
  });
});
