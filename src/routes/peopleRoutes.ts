import express from 'express';
import { getAllPeople, getPerson, addPerson } from '../controllers/peopleController.js';

const peopleRouter: express.Router = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:param', getPerson);
peopleRouter.post('/', addPerson);

export default peopleRouter;
