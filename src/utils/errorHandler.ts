import { MongoServerError } from 'mongodb';
import { ICreateError, IAppError, IErrorHandler, IErrorResponse, TErrors } from '../types/types';
import messages from './messages.js';
import app from '../app';

class AppError extends Error implements IAppError {
  status: string;
  statusCode: number;

  constructor(message = messages.error.UNKNOWN_TYPE, statusCode = 500) {
    super(message);

    this.status = (
      `${statusCode}`.startsWith('4') ? messages.error.FAIL : messages.error.ERROR
    ).toLowerCase();
    this.statusCode = statusCode;
  }
}

const createError: ICreateError = (customMessage = messages.error.UNKNOWN_TYPE, statusCode = 500) =>
  new AppError(customMessage, statusCode);

const errorHandler: IErrorHandler = (error: Error, req, res, next) => {
  let errorToHandle: AppError | undefined;

  if (error instanceof MongoServerError && error.code === 11000) {
    console.log('duplicate key error');
    errorToHandle = createError(messages.error.DATABASE_DUPLICATE, 400);
  } else if (error instanceof AppError) {
    errorToHandle = error;
  } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    errorToHandle = createError(messages.error.INVALID_JSON, 400);
  } else if (error instanceof SyntaxError) {
    errorToHandle = createError(messages.error.SYNTAX_ERROR);
  } else {
    errorToHandle = createError(error.message, 500);
  }

  if (!errorToHandle) {
    errorToHandle = createError(messages.error.UNKNOWN_TYPE, 500);
  }

  const responseObj: IErrorResponse = {
    ...errorToHandle,
    message: errorToHandle.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  res.status(responseObj.statusCode).json(responseObj);
};

export { createError, errorHandler };
