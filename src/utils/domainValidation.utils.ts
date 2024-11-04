import { messages } from '../constants/messages.js';
import { DNS_ERROR_TYPES } from '../constants/checkDns.constants.js';
import { checkDns } from './checkDns.utils.js';
import { isValidDomainFormat } from './domainFormat.utils.js';
import { DomainValidationError } from '../errors/customErrors.js';

export const domainValidation = async (domain: string): Promise<boolean> => {
  if (!isValidDomainFormat(domain)) {
    throw DomainValidationError(messages.error.DOMAIN_VALIDATION_ERROR);
  }

  try {
    const mxRecords = await checkDns(domain);
    return mxRecords.length > 0;
  } catch (error) {
    const errorWithName = error as Error & { name: string };
    if (errorWithName.name === DNS_ERROR_TYPES.DOMAIN_NOT_FOUND) {
      return false;
    }
    throw error;
  }
};
