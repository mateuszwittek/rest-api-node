import dns from 'dns';
import { DNS_ERROR_CODES, dnsErrorMap } from '../constants/checkDns.constants.js';
import { dnsConfig } from '../config/checkDns.config.js';
import { messages } from '../constants/messages.js';
import { BadRequestError, DNSLookupError, DomainValidationError } from '../errors/customErrors.js';

const createTimeout = (timeout: number): Promise<never> => {
  if (timeout <= 0 || !Number.isFinite(timeout)) {
    throw BadRequestError(messages.error.INVALID_TIMEOUT);
  }

  const controller = new AbortController();
  const timeoutError = DNSLookupError(messages.error.DOMAIN_TIMEOUT);
  timeoutError.code = DNS_ERROR_CODES.TIMEOUT;

  setTimeout(() => controller.abort(), timeout);

  return new Promise<never>((_, reject) => {
    controller.signal.addEventListener('abort', () => reject(timeoutError));
  });
};

export const handleDnsError = (error: unknown): never => {
  const errorWithCode = error as Error & { code?: string };
  const handleError = errorWithCode.code && dnsErrorMap[errorWithCode.code];

  if (handleError) {
    return handleError(errorWithCode);
  } else {
    throw DomainValidationError(messages.error.DOMAIN_VALIDATION_ERROR, errorWithCode);
  }
};

export const checkDns = async (domain: string): Promise<dns.MxRecord[]> => {
  try {
    return await Promise.race([dnsConfig.resolveMx(domain), createTimeout(dnsConfig.timeoutMs)]);
  } catch (error) {
    return handleDnsError(error);
  }
};
