import { isValidDomainFormat } from '../../../src/utils/domainFormat.utils';

describe('isValidDomainFormat', () => {
  describe('valid domains', () => {
    const validDomains = [
      'example.com',
      'sub.example.com',
      'my-domain.com',
      'domain.co.uk',
      'domain123.com',
      'my.domain.com',
    ];

    test.each(validDomains)('should return true for valid domain: %s', domain => {
      expect(isValidDomainFormat(domain)).toBe(true);
    });
  });

  describe('invalid domains', () => {
    const invalidDomains = [
      '',
      ' ',
      undefined,
      null,
      123,
      'domain',
      '.com',
      'domain.',
      'dom..com',
      'domain com',
      'domain@com',
      'domain/com',
      'domain\\com',
      'domain#com',
      'domain?com',
      'domain&com',
      'a'.repeat(256),
    ];

    test.each(invalidDomains)('should return false for invalid domain: %s', (domain: any) => {
      expect(isValidDomainFormat(domain)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle maximum length domain', () => {
      const maxLengthDomain = 'a'.repeat(251) + '.com';
      expect(isValidDomainFormat(maxLengthDomain)).toBe(true);
    });

    it('should handle domain with multiple dots', () => {
      expect(isValidDomainFormat('a.b.c.d.com')).toBe(true);
    });
  });
});
