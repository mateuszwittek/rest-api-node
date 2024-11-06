import { DNS_ERROR_CODES } from './../../../src/constants/checkDns.constants';
import { jest } from '@jest/globals';
import { MxRecord } from 'dns';
import { CheckDnsModule, DomainValidationModule } from '../../types/types';

await jest.unstable_mockModule('../../../src/utils/checkDns.utils', () => {
  return {
    __esModule: true,
    checkDns: jest.fn(),
  };
});

const { checkDns } = (await import('../../../src/utils/checkDns.utils')) as CheckDnsModule;
const { domainValidation } = (await import(
  '../../../src/utils/domainValidation.utils'
)) as DomainValidationModule;

const mxRecords: MxRecord[] = [{ exchange: 'mail.example.com', priority: 10 }];

console.log('checkDns value: ', checkDns);

describe('domainValidation utils', () => {
  it('should return true for valid domain with MX records', async () => {
    checkDns.mockResolvedValueOnce(mxRecords);
    const result = await domainValidation('gmail.com');
    expect(result).toBe(true);
  });

  it('should return false for non-existent domain', async () => {
    checkDns.mockRejectedValueOnce({ code: DNS_ERROR_CODES.NOT_FOUND });
    const result = await domainValidation('thisisnotarealdomain123456789.com');
    expect(result).toBe(false);
  });

  it('should return error for invalid domain format', async () => {
    await expect(domainValidation('not-a-domain')).rejects.toThrow();
  });

  it('should throw error for empty domain', async () => {
    await expect(domainValidation('')).rejects.toThrow();
  });
});
