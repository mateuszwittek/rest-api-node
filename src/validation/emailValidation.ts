import messages from '../utils/messages.js';
import isValidDomain from './domainValidation.js';
import isDisposableEmail from './disposableEmailValidation.js';

const emailValidation = async (value: string): Promise<boolean> => {
  if (!value) {
    throw new Error(messages.error.EMAIL_REQUIRED);
  }

  const domain = value.split('@')[1];
  const [isValid, isDisposable] = await Promise.all([
    isValidDomain(domain),
    isDisposableEmail(value),
  ]);

  if (!isValid) {
    throw new Error(messages.error.EMAIL_DOMAIN_INVALID);
  }

  if (isDisposable) {
    throw new Error(messages.error.EMAIL_DISPOSABLE);
  }

  return true;
};

export default emailValidation;
