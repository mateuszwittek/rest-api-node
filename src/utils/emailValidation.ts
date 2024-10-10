import dns from 'dns';
import { promisify } from 'util';

const disposableDomains = [
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
];

const isDisposableEmail = async (email: string): Promise<boolean> =>
  disposableDomains.includes(email.split('@')[1].toLowerCase());

const isValidDomain = async (domain: string): Promise<boolean> => {
  try {
    return (await promisify(dns.resolveMx)(domain)).length > 0;
  } catch {
    return false;
  }
};

export { isDisposableEmail, isValidDomain };
