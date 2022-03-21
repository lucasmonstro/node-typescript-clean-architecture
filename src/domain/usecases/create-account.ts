import { AccountModel } from '../models/account';

export type CreateAccountModel = Pick<
  AccountModel,
  'name' | 'email' | 'password'
>;

export type CreateAccount = {
  create(createAccountModel: CreateAccountModel): Promise<AccountModel>;
};
