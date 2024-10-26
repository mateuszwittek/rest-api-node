import express from 'express';
import validatePerson from '../../middleware/validatePerson.js';
import {
  getAllPeople,
  getPerson,
  addPerson,
  updatePerson,
  deletePerson,
} from '../../controllers/peopleController.js';

const peopleRouter = express.Router();

peopleRouter.get('/', getAllPeople);
peopleRouter.get('/:param', getPerson);
peopleRouter.post('/', validatePerson, addPerson);
peopleRouter.put('/:param', validatePerson, updatePerson);
peopleRouter.delete('/:param', deletePerson);

export default peopleRouter;
