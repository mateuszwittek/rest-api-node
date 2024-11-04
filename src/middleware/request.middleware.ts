import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../errors/customErrors.js';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    const uniqueErrors = [...new Set(errorMessages)];
    next(ValidationError(uniqueErrors.join('. ')));
    return;
  }
  next();
};
