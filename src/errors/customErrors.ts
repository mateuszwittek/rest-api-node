import messages from '../utils/messages.js';
import { IAppError } from '../types/types';

interface ErrorOptions {
  cause?: Error;
  isOperational?: boolean;
}

const createCustomError = (
  name: string,
  statusCode: number,
  message: string,
  options: ErrorOptions = {}
): IAppError => {
  const error = new Error(message) as IAppError;
  error.name = name;
  error.statusCode = statusCode;
  error.status = messages.error.ERROR;
  error.isOperational = options.isOperational ?? true;
  error.cause = options.cause;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createCustomError);
  }

  return error;
};

export const createError = (message: string, statusCode: number = 500) =>
  createCustomError('CustomError', statusCode, message);

export const ValidationError = (message: string) =>
  createCustomError('ValidationError', 400, message);

export const NotFoundError = (resource: string, cause?: Error) =>
  createCustomError('NotFoundError', 404, `${messages.error.NOT_FOUND}: ${resource}`, {
    cause: cause || new Error(`${messages.error.NOT_FOUND}: ${resource}`),
  });

export const DatabaseError = (operation: string, cause?: Error) =>
  createCustomError('DatabaseError', 500, `${messages.error.DATABASE_ERROR}: ${operation}`, {
    cause: cause || new Error(`${messages.error.DATABASE_ERROR}: ${operation}`),
  });

export const DuplicateEntryError = (field: string, cause?: Error) =>
  createCustomError('DuplicateEntryError', 409, `${messages.error.DATABASE_DUPLICATE}: ${field}`, {
    cause: cause || new Error(`${messages.error.DATABASE_DUPLICATE}: ${field}`),
  });

export const EmailValidationError = (message: string) =>
  createCustomError('EmailValidationError', 400, message);

export const BadRequestError = (message: string) =>
  createCustomError('BadRequestError', 400, message);

export const NetworkError = (message?: string, cause?: Error) =>
  createCustomError('NetworkError', 503, message || messages.error.NETWORK_ERROR, { cause });

export const DNSLookupError = (message?: string, cause?: Error) =>
  createCustomError('DNSLookupError', 504, message || messages.error.DNS_LOOKUP_ERROR, { cause });

export const DomainValidationError = (message?: string, cause?: Error) =>
  createCustomError(
    'DomainValidationError',
    400,
    message || messages.error.DOMAIN_VALIDATION_ERROR,
    { cause }
  );

export const InternalServerError = (cause?: Error) =>
  createCustomError('InternalServerError', 500, messages.error.INTERNAL_SERVER, {
    cause,
    isOperational: false,
  });
