import express from 'express';
import validatePerson from '../../middleware/validatePerson.js';
import { getAllPeople, getPerson, addPerson } from '../../controllers/peopleController.js';

const peopleRouter = express.Router();

peopleRouter.get('/', getAllPeople); // Ensure this is correct
peopleRouter.get('/:param', getPerson);
peopleRouter.post('/', validatePerson, addPerson);

export default peopleRouter;
