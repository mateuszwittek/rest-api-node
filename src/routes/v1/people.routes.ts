import express from 'express';
import {
  validateParam,
  validatePeople,
  validateUpdate,
} from '../../validation/people.validation.js';
import {
  getAllPeople,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
} from '../../controllers/people.controller.js';

export const peopleRouter = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:param', getPerson);
peopleRouter.post('/', ...validatePeople, addPerson);
peopleRouter.put('/', ...validateParam, updatePerson);
peopleRouter.put('/:param', ...validateUpdate, updatePerson);
peopleRouter.delete('/:param', deletePerson);
