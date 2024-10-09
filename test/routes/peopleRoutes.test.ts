import { IDatabaseConfig } from '../../src/types/types';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../src/app';
import connectDB from '../../src/config/database';
import Person from '../../src/models/person';
import messages from '../../src/utils/messages';
import { createError } from '../../src/utils/errorHelpers';

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
        email: 'john@example.com',
      });

      await Person.create({
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'jane@example.com',
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
        email: 'john@example.com',
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
        email: 'john@example.com',
      };

      const res = await request(app).post('/people').send(newPerson);
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe(newPerson.name);
      expect(res.body.message).toBe(messages.success.PERSON_ADDED);
    });

    it('should return 400 if required fields are missing', async () => {
      const incompletePerson = {
        name: 'John Doe',
      };

      const res = await request(app).post('/people').send(incompletePerson);
      expect(res.status).toBe(400);
    });

    it('should return 400 if username already exists', async () => {
      await Person.create({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      });

      const duplicatePerson = {
        name: 'Jane Doe',
        username: 'johndoe',
        email: 'jane@example.com',
      };

      const res = await request(app).post('/people').send(duplicatePerson);
      console.log('duplicate username res data: ', res.body);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(messages.error.DATABASE_DUPLICATE);
    });

    it('should return 400 if email already exists', async () => {
      await Person.create({
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      });

      const duplicatePerson = {
        name: 'Jane Doe',
        username: 'janedoe',
        email: 'john@example.com',
      };

      const res = await request(app).post('/people').send(duplicatePerson);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe(messages.error.DATABASE_DUPLICATE);
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
