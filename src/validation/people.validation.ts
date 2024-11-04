import { body, CustomValidator } from 'express-validator';
import { messages } from '../constants/messages.js';
import { emailValidation } from '../utils/emailValidation.utils.js';
import { validateRequest } from '../middleware/request.middleware.js';

const isRequired: CustomValidator = (value, { req }) =>
  req.method === 'POST' || value !== undefined;

export const validatePeople = [
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
    .custom(emailValidation)
    .normalizeEmail(),

  validateRequest,
];
