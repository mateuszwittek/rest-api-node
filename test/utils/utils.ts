import { Application } from 'express';
import request from 'supertest';
import { API_PATH, validPerson } from '../data/constants';
import { RequestData, RequestFunctions } from '../types/types';
import { Person } from '../../src/models/person.model';

export const cleanupDatabase = async (): Promise<void> => {
  await Person.deleteMany({});
};

export const createPerson = async (data = validPerson): Promise<IPersonDocument> => {
  return await Person.create(data);
};

export const makeRequest = (app: Application): RequestFunctions => {
  return {
    get: (path: string) => request(app).get(`${API_PATH}${path}`),
    post: (path: string, data?: RequestData) => request(app).post(`${API_PATH}${path}`).send(data),
    put: (path: string, data?: RequestData) => request(app).put(`${API_PATH}${path}`).send(data),
    delete: (path: string) => request(app).delete(`${API_PATH}${path}`),
    options: (path: string) => request(app).options(`${API_PATH}${path}`),
  };
};
