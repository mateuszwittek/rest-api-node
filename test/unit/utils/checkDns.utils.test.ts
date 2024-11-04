import { jest } from '@jest/globals';
import dns from 'dns';
import messages from '../../../src/utils/messages.js';
import { DNSLookupError, NetworkError } from '../../../src/errors/customErrors.js';
import { dnsConfig } from '../../../src/config/checkDns.config.js';
import { checkDns, handleDnsError } from '../../../src/utils/checkDns.utils.js';

const mockResolveMx = jest.spyOn(dnsConfig, 'resolveMx') as jest.MockedFunction<
  typeof dnsConfig.resolveMx
>;

describe('checkDns', () => {
  const domain = 'google.com';

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should return MX records on successful DNS lookup', async () => {
    const mockMxRecords: dns.MxRecord[] = [{ exchange: 'mail.example.com', priority: 10 }];
    mockResolveMx.mockResolvedValueOnce(mockMxRecords);

    const result = await checkDns(domain);
    expect(result).toEqual(mockMxRecords);
    expect(mockResolveMx).toHaveBeenCalledWith(domain);
  });

  it('should throw DNSLookupError on timeout', async () => {
    const error = Object.assign(new Error(messages.error.DOMAIN_TIMEOUT));
    mockResolveMx.mockImplementation(() => new Promise(() => {}));

    const dnsPromise = checkDns(domain);
    jest.advanceTimersByTime(5000);

    await expect(dnsPromise).rejects.toThrow(DNSLookupError(messages.error.DOMAIN_TIMEOUT, error));
  });

  it('should throw DNSLookupError if resolveMx fails', async () => {
    const error = Object.assign(new Error('Resolution failed'));
    mockResolveMx.mockRejectedValueOnce(error);
    await expect(checkDns(domain)).rejects.toThrow(
      DNSLookupError(messages.error.DOMAIN_VALIDATION_ERROR, error)
    );
  });
});

describe('handleDnsError', () => {
  test.each([
    {
      error: Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' }),
      expectedErrorClass: DNSLookupError,
      expectedMessage: messages.error.DOMAIN_NOT_FOUND,
    },
    {
      error: Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' }),
      expectedErrorClass: NetworkError,
      expectedMessage: messages.error.NETWORK_ERROR,
    },
    {
      error: Object.assign(new Error('ETIMEDOUT'), { code: 'ETIMEDOUT' }),
      expectedErrorClass: NetworkError,
      expectedMessage: messages.error.DOMAIN_TIMEOUT,
    },
    {
      error: Object.assign(new Error('UNKNOWN_ERROR')),
      expectedErrorClass: DNSLookupError,
      expectedMessage: messages.error.DOMAIN_VALIDATION_ERROR,
    },
  ])(
    'it throws $expectedErrorClass for error $error.message',
    ({ error, expectedErrorClass, expectedMessage }) => {
      expect(() => handleDnsError(error)).toThrow(expectedErrorClass(expectedMessage, error));
    }
  );
});
