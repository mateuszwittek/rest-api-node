import express from 'express';
import { getAllPeople, getPersonByID, addPerson } from '../controllers/peopleController.js';

const peopleRouter = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:id', getPersonByID);
peopleRouter.post('/', addPerson);

export default peopleRouter;
