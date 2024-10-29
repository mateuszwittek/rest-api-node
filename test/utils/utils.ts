import { API_PATH, validPerson } from '../data/constants.js';
import { IPersonDocument } from '../../src/types/types.js';
import Person from '../../src/models/person.js';
import { Application } from 'express';
import request from 'supertest';

export const cleanupDatabase = async (): Promise<void> => {
  await Person.deleteMany({});
};

export const createPerson = async (data = validPerson): Promise<IPersonDocument> => {
  return await Person.create(data);
};

type RequestData = Record<string, unknown>;

interface RequestFunctions {
  get: (path: string) => request.Test;
  post: (path: string, data?: RequestData) => request.Test;
  put: (path: string, data?: RequestData) => request.Test;
  delete: (path: string) => request.Test;
  options: (path: string) => request.Test;
}

export const makeRequest = (app: Application): RequestFunctions => {
  return {
    get: (path: string) => request(app).get(`${API_PATH}${path}`),
    post: (path: string, data?: RequestData) => request(app).post(`${API_PATH}${path}`).send(data),
    put: (path: string, data?: RequestData) => request(app).put(`${API_PATH}${path}`).send(data),
    delete: (path: string) => request(app).delete(`${API_PATH}${path}`),
    options: (path: string) => request(app).options(`${API_PATH}${path}`),
  };
};
