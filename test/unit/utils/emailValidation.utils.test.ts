import { jest } from '@jest/globals';
import {
  DisposableEmailValidationModule,
  DomainValidationModule,
  EmailValidationModule,
} from '../../types/types';
import { messages } from '../../../src/constants/messages';
import { EmailValidationError } from '../../../src/errors/customErrors';

await jest.unstable_mockModule('../../../src/utils/domainValidation.utils', () => ({
  domainValidation: jest.fn(),
}));
await jest.unstable_mockModule('../../../src/utils/disposableEmailValidation.utils', () => ({
  disposableEmailValidation: jest.fn(),
}));

const { domainValidation } = (await import(
  '../../../src/utils/domainValidation.utils'
)) as DomainValidationModule;
const { disposableEmailValidation } = (await import(
  '../../../src/utils/disposableEmailValidation.utils'
)) as DisposableEmailValidationModule;
const { emailValidation } = (await import(
  '../../../src/utils/emailValidation.utils'
)) as EmailValidationModule;

describe('emailValidation', () => {
  const validEmail = 'test@gmail.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllTimers();
  });

  it('should return true for valid email', async () => {
    domainValidation.mockResolvedValueOnce(true);
    disposableEmailValidation.mockResolvedValueOnce(true);

    await expect(emailValidation(validEmail)).resolves.toBe(true);
  });

  it('should throw if domain validation fails', async () => {
    domainValidation.mockRejectedValueOnce(new Error(messages.error.DOMAIN_VALIDATION_ERROR));
    disposableEmailValidation.mockResolvedValueOnce(true);

    await expect(emailValidation(validEmail)).rejects.toThrow(
      messages.error.DOMAIN_VALIDATION_ERROR
    );

    expect(domainValidation).toHaveBeenCalledWith('gmail.com');
    expect(disposableEmailValidation).toHaveBeenCalledWith(validEmail);
  });

  it('should throw error for invalid email format', async () => {
    await expect(emailValidation('invalidemail')).rejects.toThrow(messages.error.EMAIL_INVALID);
  });

  it('should throw error for empty email', async () => {
    await expect(emailValidation('')).rejects.toThrow(
      EmailValidationError(messages.error.EMAIL_REQUIRED)
    );
  });
});
