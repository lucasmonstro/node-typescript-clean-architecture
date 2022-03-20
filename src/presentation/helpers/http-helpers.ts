import { StatusCodes } from 'http-status-codes';
import ServerError from '../errors/server-error';

export const badRequest = (error: Error) => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error,
});

export const serverError = () => ({
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  body: new ServerError(),
});
