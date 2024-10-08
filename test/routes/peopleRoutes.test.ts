import { IDatabaseConfig } from '../../src/types/types';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../src/app';
import connectDB from '../../src/config/database';
import Person from '../../src/models/person';
import messages from '../../src/utils/messages';
import { createError } from '../../src/utils/errorHelpers';
import invalidDataCases from '../data/invalidRequestsData.js';

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
      console.log('POST /people create new person request body: ', res.body);
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
