import express from 'express';
import request from 'supertest';
import { limiter, limiterStore } from '../../../src/middleware/rateLimiter.middleware';
import { messages } from '../../../src/constants/messages.js';
import { successHandler } from '../../../src/middleware/successHandler.middleware';
import { config } from '../../../src/config/global.config';

describe('Rate Limiter Middleware', () => {
  let app: express.Express;
  const originalEnv = config.env;
  const originalTrustProxy = express().get('trust proxy');

  beforeAll(() => {
    config.env = 'development';
  });

  afterAll(() => {
    config.env = originalEnv;
  });

  beforeEach(() => {
    limiterStore.resetAll();
    app = express();

    const testRouter = express.Router();
    testRouter.use(limiter);
    testRouter.get('/rate-test', (req, res) => {
      successHandler(res, messages.success.SUCCESS, {}, 200);
    });
    app.use('/test', testRouter);
  });

  afterEach(() => {
    app.set('trust proxy', originalTrustProxy);
  });

  describe('Request Limits', () => {
    it('should include correct rate limit headers', async () => {
      const res = await request(app).get('/test/rate-test');

      expect(res.headers['ratelimit-limit']).toBe('5');
      expect(res.headers['ratelimit-remaining']).toBe('4');
      expect(res.headers['ratelimit-reset']).toBeDefined();
    });

    it('should allow requests within the rate limit', async () => {
      for (let i = 0; i < config.rateLimitMax; i++) {
        const res = await request(app).get('/test/rate-test');
        expect(res.status).toBe(200);
      }
    });

    it('should block requests exceeding the rate limit', async () => {
      for (let i = 0; i < config.rateLimitMax; i++) {
        await request(app).get('/test/rate-test');
      }
      const res = await request(app).get('/test/rate-test');
      expect(res.status).toBe(429);
    });

    it('should allow requests again after the window has passed', async () => {
      for (let i = 0; i < config.rateLimitMax; i++) {
        await request(app).get('/test/rate-test');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await request(app).get('/test/rate-test');
      expect(res.status).toBe(200);
    });
  });
});
