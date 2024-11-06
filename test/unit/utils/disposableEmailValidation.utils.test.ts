import { messages } from '../../../src/constants/messages';
import { disposableEmailValidation } from '../../../src/utils/disposableEmailValidation.utils';
import { EmailValidationError } from '../../../src/errors/customErrors';

describe('disposableEmailValidation', () => {
  it('should return true for a non-disposable domain', async () => {
    const email = 'user@legitdomain.com';
    await expect(disposableEmailValidation(email)).resolves.toBe(true);
  });

  it('throws EmailValidationError if email is from a disposable domain', async () => {
    await expect(disposableEmailValidation('user@tempmail.com')).rejects.toThrow(
      EmailValidationError(messages.error.EMAIL_DISPOSABLE)
    );
  });
});
