import { StatusCodes } from 'http-status-codes';
import ServerError from '../errors/server-error';
import { HttpResponse } from '../protocols';

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: StatusCodes.BAD_REQUEST,
  body: error,
});

export const created = (body?: unknown): HttpResponse<unknown | undefined> => ({
  statusCode: StatusCodes.CREATED,
  body,
});

export const serverError = (): HttpResponse<ServerError> => ({
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  body: new ServerError(),
});
