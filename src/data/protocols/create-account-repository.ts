import { AccountModel } from '../../domain/models/account';
import { CreateAccountModel } from '../../domain/usecases/create-account';

export type CreateAccountRepository = {
  create(createAccountModel: CreateAccountModel): Promise<AccountModel>;
};
