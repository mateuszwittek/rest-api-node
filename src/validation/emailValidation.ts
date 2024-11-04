import messages from '../utils/messages.js';
import { EmailValidationError } from '../errors/customErrors.js';
import isValidDomain from './domainValidation.js';
import isDisposableEmail from './disposableEmailValidation.js';
import { isValidDomainFormat } from '../utils/domainFormat.utils.js';

const emailValidation = async (value: string): Promise<boolean> => {
  if (!value) {
    throw EmailValidationError(messages.error.EMAIL_REQUIRED);
  }

  const domain = value.split('@')[1];
  if (!domain || !isValidDomainFormat(domain)) {
    throw EmailValidationError(messages.error.EMAIL_INVALID);
  }

  await Promise.all([isValidDomain(domain), isDisposableEmail(value)]);

  return true;
};

export default emailValidation;
