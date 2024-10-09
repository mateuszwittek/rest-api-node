import { MongoServerError } from 'mongodb';
import { IErrorHandler, IErrorResponse } from '../types/types';
import messages from '../utils/messages.js';
import { AppError, createError } from '../utils/errorHelpers.js';

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
