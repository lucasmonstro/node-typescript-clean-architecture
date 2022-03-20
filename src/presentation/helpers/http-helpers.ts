import { StatusCodes } from 'http-status-codes';

export const badRequest = (error: Error) => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error,
});
