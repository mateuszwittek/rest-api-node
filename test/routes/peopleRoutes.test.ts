import express from 'express';
import { IControllerFunction, IDatabaseConfig } from '../../src/types/types';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import messages from '../../src/utils/messages.js';
import rateLimiter from '../../src/middleware/rateLimiter.js';
import app from '../../src/app';
import connectDB from '../../src/config/database';
import Person from '../../src/models/person';
import invalidDataCases from '../data/invalidRequestsData.js';
import { successHandler } from '../../src/middleware/successHandler.js';
import { DatabaseError, NotFoundError } from '../../src/errors/customErrors.js';
import { MongoError } from 'mongodb';

dotenv.config();

const dbConfig = {
  uri: process.env.TEST_DATABASE_URI || '',
};

const API_PATH = '/api/v1';

const validPerson = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@gmail.com',
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
      const res = await request(app).get(`${API_PATH}/people`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
      expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
    });

    it('should return all people', async () => {
      await Person.create(validPerson);
      await Person.create({
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@gmail.com',
      });

      const res = await request(app).get(`${API_PATH}/people`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.message).toBe(messages.success.PEOPLE_RETRIEVED);
    });
  });

  describe('GET /people/:param', () => {
    it('should get person by username', async () => {
      const person = await Person.create(validPerson);
      const res = await request(app).get(`${API_PATH}/people/${person.username}`);
      expect(res.status).toBe(200);
      expect(res.body.data.username).toBe(person.username);
    });

    it('should get person by email', async () => {
      const person = await Person.create(validPerson);
      const res = await request(app).get(`${API_PATH}/people/${person.email}`);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(person.email);
    });

    it('should return 404 if person not found', async () => {
      const res = await request(app).get(`${API_PATH}/people/nonexistent`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(NotFoundError('person').message);
    });
  });

  describe('POST /people', () => {
    it('should create a new person with valid data', async () => {
      const res = await request(app).post(`${API_PATH}/people`).send(validPerson);
      expect(res.status).toBe(201);
      expect(res.body.data.username).toBe(validPerson.username);
      expect(res.body.message).toBe(messages.success.PERSON_ADDED);
    });

    test.each(invalidDataCases)('should reject $description', async ({ data }) => {
      const res = await request(app).post(`${API_PATH}/people`).send(data);
      expect(res.status).toBe(400);
      expect(res.body.status).toBe(messages.error.ERROR);
    });

    it('should reject duplicate username', async () => {
      await Person.create(validPerson);
      const res = await request(app)
        .post(`${API_PATH}/people`)
        .send({ ...validPerson, email: 'different@gmail.com' });
      expect(res.status).toBe(409);
    });

    it('should reject duplicate email', async () => {
      await Person.create(validPerson);
      const res = await request(app)
        .post(`${API_PATH}/people`)
        .send({ ...validPerson, username: 'different' });
      expect(res.status).toBe(409);
    });
  });

  describe('PUT /people/:param', () => {
    it('should update person with valid partial data', async () => {
      const person = await Person.create(validPerson);
      const update = { name: 'John Updated' };
      const res = await request(app).put(`${API_PATH}/people/${person.username}`).send(update);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(update.name);
      expect(res.body.data.username).toBe(person.username);
    });

    it('should update using email as parameter', async () => {
      const person = await Person.create(validPerson);
      const update = { name: 'John Updated' };
      const res = await request(app).put(`${API_PATH}/people/${person.email}`).send(update);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe(update.name);
    });

    it('should reject invalid update data', async () => {
      const person = await Person.create(validPerson);
      const update = { name: '123' }; // Invalid name
      const res = await request(app).put(`${API_PATH}/people/${person.username}`).send(update);
      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent person', async () => {
      const res = await request(app)
        .put(`${API_PATH}/people/nonexistent`)
        .send({ name: 'New Name' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /people/:param', () => {
    it('should delete person by username', async () => {
      const person = await Person.create(validPerson);
      const res = await request(app).delete(`${API_PATH}/people/${person.username}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe(messages.success.PERSON_DELETED);

      const found = await Person.findOne({ username: person.username });
      expect(found).toBeNull();
    });

    it('should delete person by email', async () => {
      const person = await Person.create(validPerson);
      const res = await request(app).delete(`${API_PATH}/people/${person.email}`);
      expect(res.status).toBe(200);

      const found = await Person.findOne({ email: person.email });
      expect(found).toBeNull();
    });

    it('should return 404 for non-existent person', async () => {
      const res = await request(app).delete(`${API_PATH}/people/nonexistent`);
      expect(res.status).toBe(404);
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
    router.get(`${API_PATH}/test`, getData);
    app.use(router);
  });

  it('should allow requests within the rate limit', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get(`${API_PATH}/test`);
      expect(res.status).toBe(200);
    }
  });

  it('should block requests exceeding the rate limit', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get('/test');
    }
    const res = await request(app).get(`${API_PATH}/test`);
    expect(res.status).toBe(429);
  });

  it('should allow requests again after the window has passed', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).get(`${API_PATH}/test`);
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const res = await request(app).get(`${API_PATH}/test`);
    expect(res.status).toBe(200);
  });
});

describe('Error Handling', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle operational errors with specific messages', async () => {
    // Mock a MongoDB operational error
    jest.spyOn(Person, 'find').mockImplementationOnce(() => {
      throw new MongoError('Simulated MongoDB error');
    });

    const res = await request(app).get(`${API_PATH}/people`);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe(DatabaseError('Failed to fetch people').message);
    expect(res.body.status).toBe(messages.error.ERROR);
  });

  it('should handle non-operational errors with generic message in production', async () => {
    process.env.NODE_ENV = 'production';

    jest.spyOn(Person, 'find').mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });

    const res = await request(app).get(`${API_PATH}/people`);
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

    const res = await request(app).get(`${API_PATH}/people`);
    expect(res.status).toBe(500);
    expect(res.body.stack).toBeDefined();
    expect(res.body.name).toBeDefined();
    expect(res.body.cause).toBeDefined();
    expect(res.body.status).toBe(messages.error.ERROR);
  });
});

describe('Security', () => {
  it('should set appropriate security headers', async () => {
    const res = await request(app).get(`${API_PATH}/people`);

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
    const response = await request(app).get(`${API_PATH}/`);
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('should set appropriate CORS headers', async () => {
    const res = await request(app)
      .options(`${API_PATH}/people`)
      .set('Origin', `http://localhost:3001`)
      .set('Access-Control-Request-Method', 'GET');

    expect(res.headers['access-control-allow-origin']).toBe(`http://localhost:3001`);
    expect(res.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE,OPTIONS');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should reject requests from non-allowed origins', async () => {
    const res = await request(app)
      .get(`${API_PATH}/people`)
      .set('Origin', 'http://localhost.com:4000');

    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});
