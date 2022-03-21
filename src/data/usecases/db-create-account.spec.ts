import faker from '@faker-js/faker';
import { AccountModel } from '../../domain/models/account';
import { CreateAccountModel } from '../../domain/usecases/create-account';
import { CreateAccountRepository } from '../protocols/create-account-repository';
import { Encrypter } from '../protocols/encrypter';
import DbCreateAccount from './db-create-account';

type SutTypes = {
  sut: DbCreateAccount;
  createAccountRepositoryStub: CreateAccountRepository;
  encrypterStub: Encrypter;
};

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async encrypt(_: string): ReturnType<Encrypter['encrypt']> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  class CreateAccountRepositoryStub implements CreateAccountRepository {
    async create(
      createAccountModel: CreateAccountModel,
    ): Promise<AccountModel> {
      return new Promise((resolve) => resolve(createAccountModel));
    }
  }
  const createAccountRepositoryStub = new CreateAccountRepositoryStub();
  const encrypterStub = new EncrypterStub();
  const sut = new DbCreateAccount(createAccountRepositoryStub, encrypterStub);
  return {
    sut,
    createAccountRepositoryStub,
    encrypterStub,
  };
};

describe('DbCreateAccount', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const password = faker.internet.password();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    await sut.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password,
    });
    expect(encryptSpy).toHaveBeenCalledWith(password);
  });

  it('should throw an Error when Encrypter cannot encrypt password', async () => {
    const { sut, encrypterStub } = makeSut();
    const password = faker.internet.password();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));
    await expect(
      sut.create({
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
      }),
    ).rejects.toThrow();
  });

  it('should call CreateAccountRepository with correct values', async () => {
    const { sut, createAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(createAccountRepositoryStub, 'create');
    const createAccountModel = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    await sut.create(createAccountModel);
    expect(addSpy).toHaveBeenCalledWith({
      ...createAccountModel,
      password: 'hashed_password',
    });
  });
});
