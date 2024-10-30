import { jest } from '@jest/globals';
import { responseSanitizer } from '../../../src/utils/responseSanitizer';

describe('Response Sanitizer', () => {
  let mockResponse: any;
  let mockNext: jest.Mock;
  let originalJson: jest.Mock;

  beforeEach(() => {
    originalJson = jest.fn();
    mockResponse = {
      json: originalJson,
    };
    mockNext = jest.fn();
  });

  it('should remove sensitive fields from response body', () => {
    const input = {
      username: 'john',
      email: 'john@example.com',
      password: 'secret123',
      ssn: '123-45-6789',
      token: 'jwt.token.here',
    };

    const expected = {
      username: 'john',
      email: 'john@example.com',
    };

    responseSanitizer({} as any, mockResponse, mockNext);
    mockResponse.json(input);

    expect(originalJson).toHaveBeenCalledWith(expected);
  });

  it('should handle response without sensitive fields', () => {
    const input = {
      username: 'john',
      email: 'john@example.com',
    };

    responseSanitizer({} as any, mockResponse, mockNext);
    mockResponse.json(input);

    expect(originalJson).toHaveBeenCalledWith(input);
  });

  it('should handle non-object response', () => {
    const input = 'string response';

    responseSanitizer({} as any, mockResponse, mockNext);
    mockResponse.json(input);

    expect(originalJson).toHaveBeenCalledWith(input);
  });

  it('should call next middleware', () => {
    responseSanitizer({} as any, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });
});
