import dns from 'dns';
import { DNS_ERROR_TYPES } from '../constants/checkDns.constants.js';
import { dnsConfig } from '../config/checkDns.config.js';
import { messages } from '../constants/messages.js';
import { DNSLookupError, NetworkError } from '../errors/customErrors.js';

const createTimeout = (timeout: number): Promise<never> => {
  let timeoutId: NodeJS.Timeout;

  const timeoutError = DNSLookupError(messages.error.DOMAIN_TIMEOUT);
  timeoutError.code = DNS_ERROR_TYPES.TIMEOUT;

  return new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(timeoutError), timeout);
  }).finally(() => clearTimeout(timeoutId));
};

const handleDnsError = (error: unknown): never => {
  const errorWithCode = error as Error & { code: string };
  const errorCode = errorWithCode.code;

  if (['ENOTFOUND', 'ENODATA'].includes(errorCode ?? '')) {
    const notFoundError = DNSLookupError(messages.error.DOMAIN_NOT_FOUND, error as Error);
    notFoundError.name = DNS_ERROR_TYPES.DOMAIN_NOT_FOUND;
    throw notFoundError;
  }
  if (['ECONNREFUSED', 'ECONNRESET'].includes(errorCode ?? '')) {
    const networkError = NetworkError(messages.error.DNS_NETWORK_ERROR, error as Error);
    networkError.name = DNS_ERROR_TYPES.NETWORK_ERROR;
    throw networkError;
  }
  if (['ETIMEDOUT', 'TIMEOUT'].includes(errorCode ?? '')) {
    const timeoutError = DNSLookupError(messages.error.DOMAIN_TIMEOUT, error as Error);
    timeoutError.name = DNS_ERROR_TYPES.TIMEOUT;
    throw timeoutError;
  }

  const unknownError = DNSLookupError(messages.error.DOMAIN_VALIDATION_ERROR, error as Error);
  unknownError.name = DNS_ERROR_TYPES.UNKNOWN;
  throw unknownError;
};

const checkDns = async (domain: string): Promise<dns.MxRecord[]> => {
  try {
    return await Promise.race([dnsConfig.resolveMx(domain), createTimeout(dnsConfig.timeoutMs)]);
  } catch (error) {
    return handleDnsError(error);
  }
};

export { checkDns, handleDnsError };
