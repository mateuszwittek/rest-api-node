import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import messages from '../utils/messages.js';
import { createError } from './errorHandler.js';
import { isDisposableEmail, isValidDomain } from '../utils/emailValidation.js';

const validateCallback = (req: Request, res: Response, next: NextFunction): void => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    const errorMessages = validationErrors.array().map(err => err.msg);
    return next(createError(errorMessages.join(', '), 400));
  }

  next();
};

const validEmail = async (value: string): Promise<boolean> => {
  const domain = value.split('@')[1];
  const [isValid, isDisposable] = await Promise.all([
    isValidDomain(domain),
    isDisposableEmail(value),
  ]);

  if (!isValid) {
    throw createError(messages.error.EMAIL_DOMAIN_INVALID, 400);
  }

  if (isDisposable) {
    throw createError(messages.error.EMAIL_DISPOSABLE, 400);
  }

  return true;
};

export const validatePerson = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(messages.error.NAME_REQUIRED)
    .isLength({ min: 2, max: 50 })
    .withMessage(messages.error.NAME_LENGTH)
    .matches(/^[a-z ,.'-]+$/i)
    .withMessage(messages.error.NAME_INVALID)
    .escape(),
  body('username')
    .trim()
    .notEmpty()
    .withMessage(messages.error.USERNAME_REQUIRED)
    .isLength({ min: 3, max: 30 })
    .withMessage(messages.error.USERNAME_LENGTH)
    .isAlphanumeric()
    .withMessage(messages.error.USERNAME_INVALID)
    .escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage(messages.error.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(messages.error.EMAIL_INVALID)
    .custom(validEmail)
    .normalizeEmail(),
  validateCallback,
];
export default validatePerson;
