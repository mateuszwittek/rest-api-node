import { jest } from '@jest/globals';
import { messages } from '../../../src/constants/messages.js';
import { DNS_ERROR_CODES } from '../../../src/constants/checkDns.constants.js';
import { dnsConfig } from '../../../src/config/checkDns.config.js';
import { checkDns, handleDnsError } from '../../../src/utils/checkDns.utils.js';

const mockResolveMx = jest.spyOn(dnsConfig, 'resolveMx') as jest.MockedFunction<
  typeof dnsConfig.resolveMx
>;

describe('checkDns', () => {
  afterEach(() => {
    jest.clearAllTimers();
    mockResolveMx.mockReset();
  });

  it('should return MX records for a valid domain', async () => {
    jest.useFakeTimers();
    mockResolveMx.mockResolvedValue([{ exchange: 'smtp.google.com', priority: 10 }]);

    const dnsCheck = checkDns('google.com');

    jest.runAllTimers();

    await expect(dnsCheck).resolves.toEqual([{ exchange: 'smtp.google.com', priority: 10 }]);
    jest.useRealTimers();
  });

  it('should throw DNSLookupError on timeout', async () => {
    jest.useFakeTimers();
    mockResolveMx.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 10000)));

    const dnsCheck = checkDns('google.com');

    jest.runAllTimers();

    await expect(dnsCheck).rejects.toThrow(messages.error.DOMAIN_TIMEOUT);

    jest.useRealTimers();
  }, 11000);

  it('should handle ENOTFOUND error code as DOMAIN_NOT_FOUND', () => {
    const error = new Error(messages.error.DOMAIN_NOT_FOUND) as Error & { code: string };
    error.code = DNS_ERROR_CODES.NOT_FOUND;
    expect(() => handleDnsError(error)).toThrow(messages.error.DOMAIN_NOT_FOUND);
  });

  it('should handle unknown error codes as DomainValidationError', () => {
    const error = new Error(messages.error.DOMAIN_VALIDATION_ERROR);
    expect(() => handleDnsError(error)).toThrow(messages.error.DOMAIN_VALIDATION_ERROR);
  });
});
