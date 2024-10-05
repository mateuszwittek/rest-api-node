import express from 'express';
import { getAllPeople, getPerson, addPerson } from '../controllers/peopleController.js';

const peopleRouter = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:id', getPerson);
peopleRouter.post('/', addPerson);

export default peopleRouter;
