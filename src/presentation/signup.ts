export default class SignUpController {
  handle(httpRequest) {
    const nameIsNotProvided = !httpRequest.body.name;
    if (nameIsNotProvided) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }
    const emailIsNotProvided = !httpRequest.body.email;
    if (emailIsNotProvided) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }
    return {
      statusCode: 400,
      body: {},
    };
  }
}
