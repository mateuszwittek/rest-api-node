import { API_PATH, validPerson } from '../data/constants.js';
import Person from '../../src/models/person.js';
import { Application } from 'express';
import request from 'supertest';

export const cleanupDatabase = async () => {
  await Person.deleteMany({});
};

export const createPerson = async (data = validPerson) => {
  return await Person.create(data);
};

export const makeRequest = (app: Application) => {
  return {
    get: (path: string) => request(app).get(`${API_PATH}${path}`),
    post: (path: string, data?: any) => request(app).post(`${API_PATH}${path}`).send(data),
    put: (path: string, data?: any) => request(app).put(`${API_PATH}${path}`).send(data),
    delete: (path: string) => request(app).delete(`${API_PATH}${path}`),
    options: (path: string) => request(app).options(`${API_PATH}${path}`),
  };
};
