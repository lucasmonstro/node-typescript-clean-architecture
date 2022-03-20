import isEmail from 'validator/lib/isEmail';
import { EmailValidator } from '../presentation/controllers/signup-protocols';

export default class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    return isEmail(email);
  }
}
