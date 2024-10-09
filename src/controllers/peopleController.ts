import { IControllerFunction } from '../types/types';
import { getPeopleData, getPersonData, addPeopleData } from '../services/peopleService.js';
import messages from '../utils/messages.js';
import { errors } from '../utils/errorHandler.js';
import { successHandler } from '../utils/successHandler.js';

const getAllPeople: IControllerFunction = async (req, res, next) => {
  try {
    const people = await getPeopleData();
    successHandler(res, messages.success.PEOPLE_RETRIEVED, people);
  } catch (error) {
    next(error as Error);
  }
};

const getPerson: IControllerFunction = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = await getPersonData(id);
    successHandler(res, messages.success.PERSON_RETRIEVED, person);
  } catch (error) {
    next(error as Error);
  }
};

const addPerson: IControllerFunction = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;

    if (!name || !username || !email) {
      return next(errors.BAD_REQUEST(messages.error.REQUIRED_FIELDS));
    }
    const newPerson = { name, username, email };
    const createdPerson = await addPeopleData(newPerson);
    successHandler(res, messages.success.PERSON_ADDED, createdPerson, 201);
  } catch (error) {
    next(error as Error);
  }
};
export { getAllPeople, getPerson, addPerson };