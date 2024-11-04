import express from 'express';
import { validatePeople } from '../../validation/people.validation.js';
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
peopleRouter.post('/', validatePeople, addPerson);
peopleRouter.put('/:param', validatePeople, updatePerson);
peopleRouter.delete('/:param', deletePerson);
