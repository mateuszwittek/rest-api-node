import express from 'express';
import request from 'supertest';
import rateLimit from 'express-rate-limit';
import rateLimiter from '../../../src/middleware/rateLimiter';
import messages from '../../../src/utils/messages.js';
import { IControllerFunction } from '../../../src/types/types.js';
import { successHandler } from '../../../src/middleware/successHandler.js';

describe('Rate Limiter Middleware', () => {
  let app: express.Express;
  const router: express.Router = express.Router();
  const getData: IControllerFunction = async (req: express.Request, res: express.Response) => {
    successHandler(res, messages.success.SUCCESS, {}, 200);
  };

  beforeEach(() => {
    app = express();
    const testLimiter = rateLimit({
      ...rateLimiter,
      windowMs: 1000, // 1 second for testing
      max: 5,
    });

    app.use(testLimiter);
    router.get('/test', getData);
    app.use(router);
  });

  describe('Request Limits', () => {
    it('should allow requests within the rate limit', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app).get('/test');
        expect(res.status).toBe(200);
      }
    });

    it('should block requests exceeding the rate limit', async () => {
      // Make 5 requests to hit the limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/test');
      }

      // This request should be blocked
      const res = await request(app).get('/test');
      expect(res.status).toBe(429);
    });

    it('should allow requests again after the window has passed', async () => {
      // Hit the rate limit
      for (let i = 0; i < 5; i++) {
        await request(app).get('/test');
      }

      // Wait for the window to reset
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Should work again
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
    });
  });
});
