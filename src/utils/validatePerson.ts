import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import messages from './messages.js';
import { createError } from './errorHandler.js';

const validateCallback = (req: Request, res: Response, next: NextFunction): void => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorMessages = validationErrors.array().map(err => err.msg);
    return next(createError(errorMessages.join(', '), 400));
  }

  next();
};

export const validatePerson = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(messages.error.NAME_REQUIRED)
    .matches(/^[a-z ,.'-]+$/i)
    .withMessage(messages.error.NAME_INVALID)
    .escape(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage(messages.error.USERNAME_REQUIRED)
    .isAlphanumeric()
    .withMessage(messages.error.USERNAME_INVALID)
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage(messages.error.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(messages.error.EMAIL_INVALID)
    .normalizeEmail(),
  validateCallback,
];
export default validatePerson;
