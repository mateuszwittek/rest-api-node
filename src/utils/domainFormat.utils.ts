export const isValidDomainFormat = (domain: string): boolean => {
  if (!domain || typeof domain !== 'string') {
    return false;
  }
  return (
    domain.length <= 255 &&
    domain.includes('.') &&
    !domain.includes('..') &&
    !domain.startsWith('.') &&
    !domain.endsWith('.') &&
    !domain.includes(' ') &&
    /^[a-zA-Z0-9.-]+$/.test(domain)
  );
};
