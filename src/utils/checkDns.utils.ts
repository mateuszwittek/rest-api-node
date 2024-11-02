import dns from 'dns';
import { DNS_ERROR_TYPES } from '../constants/checkDns.constants.js';
import dnsConfig from '../config/checkDns.config.js';
import messages from './messages.js';
import { DNSLookupError, NetworkError } from '../errors/customErrors.js';

const createTimeout = (timeout: number): Promise<never> =>
  new Promise<never>((_, reject) => {
    setTimeout(() => {
      const timeoutError = DNSLookupError(messages.error.DOMAIN_TIMEOUT);
      timeoutError.name = DNS_ERROR_TYPES.TIMEOUT;
      reject(timeoutError);
    }, timeout);
  });

export const handleDnsError = (error: unknown): never => {
  if (error instanceof Error) {
    const errorCode = (error as { code?: string }).code;

    if (error.message.includes('ENOTFOUND')) {
      const notFoundError = DNSLookupError(messages.error.DOMAIN_NOT_FOUND, error);
      notFoundError.name = DNS_ERROR_TYPES.DOMAIN_NOT_FOUND;
      throw notFoundError;
    }
    if (['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'].includes(errorCode || '')) {
      const networkError = NetworkError(messages.error.DNS_NETWORK_ERROR, error);
      networkError.name = DNS_ERROR_TYPES.NETWORK_ERROR;
      throw networkError;
    }
    if (errorCode === DNS_ERROR_TYPES.TIMEOUT) {
      throw error;
    }
  }

  const validationError = DNSLookupError(messages.error.DOMAIN_VALIDATION_ERROR, error as Error);
  validationError.name = DNS_ERROR_TYPES.UNKNOWN;
  throw validationError;
};

export const checkDns = async (domain: string): Promise<dns.MxRecord[]> => {
  try {
    return await Promise.race([dnsConfig.resolveMx(domain), createTimeout(dnsConfig.timeoutMs)]);
  } catch (error) {
    return handleDnsError(error);
  }
};
