import { messages } from '../constants/messages.js';
import { EmailValidationError } from '../errors/customErrors.js';
import { domainValidation } from './domainValidation.utils.js';
import { disposableEmailValidation } from './disposableEmailValidation.utils.js';
import { isValidDomainFormat } from './domainFormat.utils.js';

export const emailValidation = async (value: string): Promise<boolean> => {
  if (!value) {
    throw EmailValidationError(messages.error.EMAIL_REQUIRED);
  }

  const domain = value.split('@')[1];
  if (!domain || !isValidDomainFormat(domain)) {
    throw EmailValidationError(messages.error.EMAIL_INVALID);
  }

  await Promise.all([domainValidation(domain), disposableEmailValidation(value)]);

  return true;
};
