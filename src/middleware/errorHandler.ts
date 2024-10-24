import { IErrorHandler, IErrorResponse, IAppError } from '../types/types';
import messages from '../utils/messages.js';
import { sanitize } from './../utils/sanitize.js';

const errorHandler: IErrorHandler = (error, req, res, next) => {
  let status = 'Error';
  let statusCode = error.statusCode || 500;
  let message = error.isOperational ? error.message : messages.error.INTERNAL_SERVER;

  const responseObj: IErrorResponse = {
    status,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    }),
  };

  res.status(responseObj.statusCode).json(sanitize(responseObj));
};

export default errorHandler;
