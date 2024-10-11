import express from 'express';
import { IControllerFunction, IDatabaseConfig } from '../../src/types/types';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import rateLimiter from '../../src/middleware/rateLimiter.js';
import app from '../../src/app';
import connectDB from '../../src/config/database';
import Person from '../../src/models/person';
import messages from '../../src/utils/messages';
import { createError } from '../../src/utils/errorHelpers';
import invalidDataCases from '../data/invalidRequestsData.js';
import { successHandler } from '../../src/middleware/successHandler.js';

dotenv.config();

const dbConfig = {
  uri: process.env.TEST_DATABASE_URI || '',
};

beforeAll(async () => {
  await connectDB(dbConfig as IDatabaseConfig);
});

afterAll(async () => {
  await mongoose.disconnect();
});

beforeEach(async () => {
  await Person.deleteMany({});
});

describe('People API Endpoints', () => {
  describe('GET /people', () => {
    it('should return an empty array when no people exist', async () => {
      const res = await request(app).get('/people');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
    });
    it('should return all people', async () => {
      await Person.create({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@gmail.com',
      });

      await Person.create({
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@gmail.com',
      });
      const res = await request(app).get('/people');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
    });
  });

  describe('GET /people/:param', () => {
    it('should return a single person', async () => {
      const person = await Person.create({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@gmail.com',
      });

      const res = await request(app).get(`/people/${person.username}`);
      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe(person.username);
      expect(res.body.message).toBe(messages.success.PERSON_RETRIEVED);
    });

    it('should return 404 if person does not exist', async () => {
      const res = await request(app).get('/people/invalid-username');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(messages.error.PERSON_NOT_FOUND);
    });
  });

  describe('POST /people', () => {
    it('should create a new person', async () => {
      const newPerson = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@gmail.com',
      };

      const res = await request(app).post('/people').send(newPerson);
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(newPerson.name);
      expect(res.body.message).toBe(messages.success.PERSON_ADDED);
    });

    test.each(invalidDataCases)('should return 400 for $description', async ({ data }) => {
      const res = await request(app).post('/people').send(data);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe(messages.error.FAIL.toLowerCase());
      expect(res.body).toHaveProperty('message');
    });
  });
});

describe('Rate Limiter', () => {
  let app: express.Express;
  const router: express.Router = express.Router();
  const getData: IControllerFunction = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    successHandler(res, messages.success.SUCCESS, {}, 200);
  };

  beforeEach(() => {
    app = express();
    const testLimiter = rateLimit({
      ...rateLimiter,
      windowMs: 1000,
      max: 5,
    });
    app.use(testLimiter);
    router.get('/test', getData);
    app.use(router);
  });

  it('should allow requests within the rate limit', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/test');
      expect(res.status).toBe(200);
    }
  });

  it('should block requests exceeding the rate limit', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get('/test');
    }
    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
  });

  it('should allow requests again after the window has passed', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get('/test');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
  });
});

describe('Error Handling', () => {
  it('should handle 404 errors for non-existent routes', async () => {
    const res = await request(app).get('/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.message).toBe(messages.error.NOT_FOUND);
  });

  it('should handle internal server errors', async () => {
    jest.spyOn(Person, 'find').mockImplementationOnce(() => {
      throw createError(messages.error.DATABASE_QUERY_EXECUTION_ERROR);
    });

    const res = await request(app).get('/people');
    expect(res.status).toBe(500);
    expect(res.body.message).toBe(messages.error.DATABASE_QUERY_EXECUTION_ERROR);

    jest.restoreAllMocks();
  });
});

describe('Security', () => {
  it('should set appropriate security headers', async () => {
    const res = await request(app).get('/people');

    expect(res.headers['content-security-policy']).toBe(
      "default-src 'none';connect-src 'self';base-uri 'none';font-src 'none';form-action 'none';frame-ancestors 'none';img-src 'none';object-src 'none';script-src 'none';script-src-attr 'none';style-src 'none'"
    );

    expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');

    expect(res.headers['x-xss-protection']).toBe('0');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
  });

  it('should not include X-Powered-By header', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('should set appropriate CORS headers', async () => {
    const res = await request(app)
      .options('/people')
      .set('Origin', `http://localhost:3001`)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(`http://localhost:3001`);
    expect(res.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE,OPTIONS');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should reject requests from non-allowed origins', async () => {
    const res = await request(app).get('/people').set('Origin', 'http://localhost.com:4000');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
