import { jest } from '@jest/globals';
import { successHandler } from '../../../src/middleware/successHandler';
import messages from '../../../src/utils/messages';

describe('Success Handler', () => {
  const message = messages.success.PEOPLE_RETRIEVED;
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Parameters<ISuccessHandler>[0];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle response with provided data and status code', () => {
    const data = { username: 'johndoe' };
    const statusCode = 201;

    successHandler(mockRes, message, data, statusCode);

    expect(mockRes.status).toHaveBeenCalledWith(statusCode);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: message,
      statusCode,
      message,
      data,
    });
  });

  it('should handle response with default data and status code', () => {
    successHandler(mockRes, message);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: message,
      statusCode: 200,
      message,
      data: {},
    });
  });
});
