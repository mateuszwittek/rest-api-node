import { IErrorHandler, IErrorResponse } from '../types/types';
import messages from '../utils/messages.js';
import { sanitize } from './../utils/sanitize.js';

const errorHandler: IErrorHandler = (error, req, res, _next) => {
  const status = 'Error';
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : messages.error.INTERNAL_SERVER;

  if (process.env.NODE_ENV === 'development') {
    error.cause = {
      originalError: error.message,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };
  }

  const responseObj: IErrorResponse = {
    status,
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      cause: error.cause,
    }),
  };

  res.status(responseObj.statusCode).json(sanitize(responseObj));
};

export default errorHandler;
