import { IControllerFunction } from '../types/types';
import { getPeopleData, getPersonData, addPeopleData } from '../services/peopleService.js';
import messages from '../utils/messages.js';
import { successHandler } from '../middleware/successHandler.js';

const getAllPeople: IControllerFunction = async (req, res, next) => {
  try {
    const people = await getPeopleData();
    successHandler(res, messages.success.PEOPLE_RETRIEVED, people);
  } catch (error) {
    next(error);
  }
};

const getPerson: IControllerFunction = async (req, res, next) => {
  try {
    const param = req.params.param;
    const person = await getPersonData(param);
    successHandler(res, messages.success.PERSON_RETRIEVED, person);
  } catch (error) {
    next(error);
  }
};

const addPerson: IControllerFunction = async (req, res, next) => {
  try {
    const newPerson = await addPeopleData(req.body);
    successHandler(res, messages.success.PERSON_ADDED, newPerson, 201);
  } catch (error) {
    next(error);
  }
};

export { getAllPeople, getPerson, addPerson };
