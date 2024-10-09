import express from 'express';
import { validatePerson } from '../utils/validatePerson.js';
import { getAllPeople, getPerson, addPerson } from '../controllers/peopleController.js';

const peopleRouter: express.Router = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:param', getPerson);
peopleRouter.post('/', validatePerson, addPerson);

export default peopleRouter;
