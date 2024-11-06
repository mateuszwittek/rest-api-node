import { body, param } from 'express-validator';
import { messages } from '../constants/messages.js';
import { emailValidation } from '../utils/emailValidation.utils.js';
import { validateEmptyBody } from '../utils/validation.utils.js';
import { validateRequest } from '../middleware/request.middleware.js';

export const validateParam = [
  param('param')
    .exists()
    .withMessage(messages.error.BAD_REQUEST)
    .notEmpty()
    .withMessage(messages.error.BAD_REQUEST),
  validateRequest,
];

export const validatePeople = [
  validateEmptyBody(messages.error.REQUIRED_FIELDS),
  validateRequest,

  body('name')
    .exists()
    .withMessage(messages.error.NAME_REQUIRED)
    .notEmpty()
    .withMessage(messages.error.NAME_REQUIRED)
    .matches(/^[a-z ,.'-]+$/i)
    .withMessage(messages.error.NAME_INVALID)
    .isLength({ min: 2, max: 50 })
    .withMessage(messages.error.NAME_LENGTH),

  body('username')
    .exists()
    .withMessage(messages.error.USERNAME_REQUIRED)
    .notEmpty()
    .withMessage(messages.error.USERNAME_REQUIRED)
    .isAlphanumeric()
    .withMessage(messages.error.USERNAME_INVALID)
    .isLength({ min: 3, max: 30 })
    .withMessage(messages.error.USERNAME_LENGTH),

  body('email')
    .exists()
    .withMessage(messages.error.EMAIL_REQUIRED)
    .notEmpty()
    .withMessage(messages.error.EMAIL_REQUIRED)
    .isEmail()
    .withMessage(messages.error.EMAIL_INVALID)
    .custom(emailValidation),

  validateRequest,
];

export const validateUpdate = [
  validateParam,
  validateEmptyBody(messages.error.BAD_REQUEST),
  validateRequest,

  body('name')
    .optional()
    .notEmpty()
    .withMessage(messages.error.NAME_INVALID)
    .matches(/^[a-z ,.'-]+$/i)
    .withMessage(messages.error.NAME_INVALID)
    .isLength({ min: 2, max: 50 })
    .withMessage(messages.error.NAME_LENGTH),

  body('username')
    .optional()
    .notEmpty()
    .withMessage(messages.error.USERNAME_INVALID)
    .isAlphanumeric()
    .withMessage(messages.error.USERNAME_INVALID)
    .isLength({ min: 3, max: 30 })
    .withMessage(messages.error.USERNAME_LENGTH),

  body('email')
    .optional()
    .notEmpty()
    .withMessage(messages.error.EMAIL_INVALID)
    .isEmail()
    .withMessage(messages.error.EMAIL_INVALID)
    .custom(emailValidation),

  validateRequest,
];
