import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import messages from '../utils/messages.js';
import { ValidationError } from '../errors/customErrors.js';
import validateEmail from '../validation/emailValidation.js';

const validateRequest = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    const uniqueErrors = [...new Set(errorMessages)];
    next(ValidationError(uniqueErrors.join('. ')));
    return;
  }

  next();
};

const validatePerson = [
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
    .custom(validateEmail)
    .normalizeEmail(),
  validateRequest,
];

export default validatePerson;
