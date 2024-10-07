import { ICreateError, IAppError, IErrorHandler, IErrorResponse, TErrors } from '../types/types';
import messages from './messages.js';

class AppError extends Error implements IAppError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message = messages.error.UNKNOWN_TYPE, statusCode = 500) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? messages.error.FAIL.toLowerCase()
      : messages.error.ERROR.toLowerCase();
    this.isOperational = true;
  }
}

const createError: ICreateError = (customMessage, statusCode) =>
  new AppError(customMessage || messages.error.UNKNOWN_TYPE, statusCode);

const errors: TErrors = Object.freeze({
  BAD_REQUEST: (customMessage = messages.error.BAD_REQUEST) => createError(customMessage, 400),
  UNAUTHORIZED: (customMessage = messages.error.UNAUTHORIZED) => createError(customMessage, 401),
  FORBIDDEN: (customMessage = messages.error.FORBIDDEN) => createError(customMessage, 403),
  NOT_FOUND: (customMessage = messages.error.NOT_FOUND) => createError(customMessage, 404),
  INTERNAL_SERVER: (customMessage = messages.error.INTERNAL_SERVER) =>
    createError(customMessage, 500),
});

const errorHandler: IErrorHandler = (error, req, res, next) => {
  const {
    statusCode = 500,
    message = messages.error.INTERNAL_SERVER,
    status = messages.error.ERROR,
  } = error;

  const responseObj: IErrorResponse = {
    status,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  res.status(statusCode).json(responseObj);
};

export { errors, errorHandler };
