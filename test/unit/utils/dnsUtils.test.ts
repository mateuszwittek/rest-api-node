import messages from '../../../src/utils/messages';
import { DNSLookupError, NetworkError } from '../../../src/errors/customErrors';
import { handleDnsError } from '../../../src/utils/checkDns.utils';

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
      expectedMessage: messages.error.NETWORK_ERROR,
    },
    {
      error: Object.assign(new Error('UNKNOWN_ERROR')),
      expectedErrorClass: DNSLookupError,
      expectedMessage: messages.error.DOMAIN_VALIDATION_ERROR,
    },
  ])(
    'it throws $expectedErrorClass  $expectedType for error $error.message',
    ({ error, expectedErrorClass, expectedMessage }) => {
      expect(() => handleDnsError(error)).toThrow(expectedErrorClass(expectedMessage, error));
    }
  );
});
