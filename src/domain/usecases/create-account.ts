export type CreateAccountModel = {
  name: string;
  email: string;
  password: string;
};

export type CreateAccount = {
  create(createAccountModel: CreateAccountModel);
};
