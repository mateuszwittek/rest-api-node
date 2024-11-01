import dns from 'dns';
import dnsConfig from '../config/dns.config.js';
import messages from './messages.js';
import { DNSLookupError, NetworkError } from '../errors/customErrors.js';

export const performDnsLookup = async (domain: string): Promise<dns.MxRecord[]> => {
  try {
    return await Promise.race([
      dnsConfig.resolveMx(domain),
      new Promise<dns.MxRecord[]>((_, reject) => {
        const timeoutError = DNSLookupError(messages.error.DOMAIN_TIMEOUT);
        timeoutError.name = DNS_ERROR_TYPES.TIMEOUT;
        setTimeout(() => reject(timeoutError), dnsConfig.timeoutMs);
      }),
    ]);
  } catch (error) {
    throw handleDnsError(error);
  }
};

export const handleDnsError = (error: unknown): never => {
  if (error instanceof Error) {
    if (error.message.includes('ENOTFOUND')) {
      const notFoundError = DNSLookupError(messages.error.DOMAIN_NOT_FOUND, error);
      notFoundError.name = DNS_ERROR_TYPES.DOMAIN_NOT_FOUND;
      throw notFoundError;
    }

    if (
      ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'].includes((error as { code?: string }).code || '')
    ) {
      const networkError = NetworkError(messages.error.DNS_NETWORK_ERROR, error);
      networkError.name = DNS_ERROR_TYPES.NETWORK_ERROR;
      throw networkError;
    }
  }

  const unknownError = DNSLookupError(
    messages.error.DOMAIN_VALIDATION_ERROR,
    error instanceof Error ? error : undefined
  );
  unknownError.name = DNS_ERROR_TYPES.UNKNOWN;
  throw unknownError;
};
