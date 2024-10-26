import { Request, Response, NextFunction } from 'express';
import { body, validationResult, CustomValidator } from 'express-validator';
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

const isRequired: CustomValidator = (value, { req }) =>
  req.method === 'POST' || value !== undefined;

const validatePerson = [
  body('name')
    .if(isRequired)
    .trim()
    .notEmpty()
    .withMessage(messages.error.NAME_REQUIRED)
    .matches(/^[a-z ,.'-]+$/i)
    .withMessage(messages.error.NAME_INVALID)
    .isLength({ min: 2, max: 50 })
    .withMessage(messages.error.NAME_LENGTH)
    .escape(),

  body('username')
    .if(isRequired)
    .trim()
    .notEmpty()
    .withMessage(messages.error.USERNAME_REQUIRED)
    .isAlphanumeric()
    .withMessage(messages.error.USERNAME_INVALID)
    .isLength({ min: 3, max: 30 })
    .withMessage(messages.error.USERNAME_LENGTH)
    .escape(),

  body('email')
    .if(isRequired)
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
