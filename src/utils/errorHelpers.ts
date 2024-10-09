import { ICreateError, IAppError } from '../types/types';
import messages from './messages.js';

export class AppError extends Error implements IAppError {
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

export const createError: ICreateError = (
  customMessage = messages.error.UNKNOWN_TYPE,
  statusCode = 500
) => new AppError(customMessage, statusCode);
