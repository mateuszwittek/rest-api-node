import { body, CustomValidator } from 'express-validator';
import { messages } from '../constants/messages';
import { ValidationError } from '../errors/customErrors';

export const isRequired: CustomValidator = (value, { req }) =>
  req.method === 'POST' || value !== undefined;

export const hasAnyField: CustomValidator = (value, { req }) => {
  const hasFields = Object.keys(req.body).length > 0;
  if (!hasFields) {
    throw ValidationError(messages.error.REQUIRED_FIELDS);
  }
  return true;
};

export const validateEmptyBody = (errorMessage: string) =>
  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw ValidationError(errorMessage);
    }
    return true;
  });
