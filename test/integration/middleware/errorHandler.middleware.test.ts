import { jest } from '@jest/globals';
import app from '../../../src/app';
import { messages } from '../../../src/constants/messages';
import { Person } from '../../../src/models/person.model';
import { DatabaseError } from '../../../src/errors/customErrors';
import { MongoError } from 'mongodb';
import { makeRequest } from '../../utils/utils';

const api = makeRequest(app);

describe('Error Handling', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  describe('Operational Errors', () => {
    it('should handle database errors with specific messages', async () => {
      jest.spyOn(Person, 'find').mockImplementationOnce(() => {
        throw new MongoError('Simulated MongoDB error');
      });

      const res = await api.get('/people');
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(DatabaseError('Failed to fetch people').message);
      expect(res.body.status).toBe(messages.error.ERROR);
    });
  });

  describe('Environment-specific Error Handling', () => {
    it('should handle non-operational errors with generic message in production', async () => {
      process.env.NODE_ENV = 'production';
      jest.spyOn(Person, 'find').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      const res = await api.get('/people');
      expect(res.status).toBe(500);
      expect(res.body.message).toBe(messages.error.INTERNAL_SERVER);
      expect(res.body.status).toBe(messages.error.ERROR);
    });

    it('should include error details for non-operational errors in development', async () => {
      process.env.NODE_ENV = 'development';
      const errorMessage = 'Unexpected development error';

      jest.spyOn(Person, 'find').mockImplementationOnce(() => {
        throw new Error(errorMessage);
      });

      const res = await api.get('/people');
      expect(res.status).toBe(500);
      expect(res.body.cause).toBeDefined();
      expect(res.body.status).toBe(messages.error.ERROR);
    });
  });
});
