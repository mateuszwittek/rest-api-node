import { messages } from '../constants/messages.js';
import { DNSLookupError, NetworkError } from '../errors/customErrors.js';

export enum DNS_ERROR_TYPES {
  DOMAIN_NOT_FOUND = 'DOMAIN_NOT_FOUND',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

export enum DNS_ERROR_CODES {
  CONNECTION_REFUSED = 'ECONNREFUSED',
  TIMEOUT = 'ETIMEDOUT',
  CONNECTION_RESET = 'ECONNRESET',
  NOT_FOUND = 'ENOTFOUND',
}

export const DNS_TIMEOUT_MS = 5000;

export const dnsErrorMap: Record<string, (error: Error) => never> = {
  [DNS_ERROR_CODES.NOT_FOUND]: error => {
    throw DNSLookupError(messages.error.DOMAIN_NOT_FOUND, error);
  },
  [DNS_ERROR_CODES.CONNECTION_REFUSED]: error => {
    throw NetworkError(messages.error.DNS_NETWORK_ERROR, error);
  },
  [DNS_ERROR_CODES.CONNECTION_RESET]: error => {
    throw NetworkError(messages.error.DNS_NETWORK_ERROR, error);
  },
  [DNS_ERROR_CODES.TIMEOUT]: error => {
    throw DNSLookupError(messages.error.DOMAIN_TIMEOUT, error);
  },
};
