import { performDnsLookup } from '../utils/dnsUtils.js';
import messages from '../utils/messages.js';
import { DomainValidationError, NetworkError } from '../errors/customErrors.js';

export const domainValidation = async (domain: string): Promise<boolean> => {
  try {
    const mxRecords = await performDnsLookup(domain);
    return mxRecords.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      switch (error.name) {
        case DNS_ERROR_TYPES.DOMAIN_NOT_FOUND:
          return false;
        case DNS_ERROR_TYPES.NETWORK_ERROR:
          throw NetworkError(messages.error.DOMAIN_NETWORK_ERROR, error);
        case DNS_ERROR_TYPES.TIMEOUT:
          throw NetworkError(messages.error.DOMAIN_TIMEOUT, error);
        default:
          throw DomainValidationError(messages.error.DOMAIN_VALIDATION_ERROR, error);
      }
    }
    throw DomainValidationError(messages.error.DOMAIN_UNKNOWN);
  }
};

export default domainValidation;
