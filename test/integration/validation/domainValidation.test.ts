import { jest } from '@jest/globals';
import { domainValidation } from '../../../src/validation/domainValidation';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllTimers();
});

describe('Domain Validation Integration Tests', () => {
  it('should return true for valid domain with MX records', async () => {
    const result = await domainValidation('gmail.com');
    expect(result).toBe(true);
  });

  it('should return false for non-existent domain', async () => {
    const result = await domainValidation('thisisnotarealdomain123456789.com');
    expect(result).toBe(false);
  });

  it('should return error for invalid domain format', async () => {
    await expect(domainValidation('not-a-domain')).rejects.toThrow();
  });

  it('should return true for valid business domain', async () => {
    const result = await domainValidation('microsoft.com');
    expect(result).toBe(true);
  });

  it('should throw error for empty domain', async () => {
    await expect(domainValidation('')).rejects.toThrow();
  });

  it('should handle international domains', async () => {
    const result = await domainValidation('google.co.uk');
    expect(result).toBe(true);
  });

  it('should handle DNS timeout appropriately', async () => {
    jest.setTimeout(10000);
    const result = await domainValidation('verylongdomainname.com');
    expect(result).toBe(false);
  });
});
