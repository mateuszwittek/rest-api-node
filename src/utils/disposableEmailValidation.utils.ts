import { messages } from '../constants/messages.js';
import { EmailValidationError } from '../errors/customErrors.js';

const disposableDomains = Object.freeze([
  'tempmail.com',
  'throwawaymail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'yopmail.com',
  'sharklasers.com',
  'getairmail.com',
  'temp-mail.org',
  'dispostable.com',
  'fakeinbox.com',
  'trashmail.com',
  'getnada.com',
  'tempr.email',
  'tempail.com',
  'burnermail.io',
  'mytemp.email',
  'mohmal.com',
  'crazymailing.com',
  'emailondeck.com',
  'example.com',
]);

export const disposableEmailValidation = async (email: string): Promise<boolean> => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    throw EmailValidationError(messages.error.EMAIL_DISPOSABLE);
  }
  return true;
};
