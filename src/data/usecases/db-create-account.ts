import {
  CreateAccount,
  CreateAccountModel,
} from '../../domain/usecases/create-account';
import { CreateAccountRepository } from '../protocols/create-account-repository';
import { Encrypter } from '../protocols/encrypter';

export default class DbCreateAccount implements CreateAccount {
  constructor(
    private createAccountRepository: CreateAccountRepository,
    private encrypter: Encrypter,
  ) {}

  async create(
    createAccount: CreateAccountModel,
  ): ReturnType<CreateAccount['create']> {
    const hashedPassword = await this.encrypter.encrypt(createAccount.password);
    const account = await this.createAccountRepository.create({
      ...createAccount,
      password: hashedPassword,
    });
    return account;
  }
}
