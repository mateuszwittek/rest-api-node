import Person from '../models/person.js';
import messages from '../utils/messages.js';
import { errors } from '../utils/errorHandler.js';
import { successHandler } from '../utils/successHandler.js';

const getPeopleData = async () => {
  try {
    return await Person.find({}, { _id: 0 });
  } catch (error) {
    throw errors.INTERNAL_SERVER(messages.error.DATABASE_QUERY_EXECUTION_ERROR);
  }
};

const getPersonData = async id => {
  try {
    const person = await Person.findOne({ id }, { _id: 0 });
    if (!person) {
      throw errors.NOT_FOUND(messages.error.PERSON_NOT_FOUND);
    }
    return person;
  } catch (error) {
    if (error.name === 'CastError') {
      throw errors.BAD_REQUEST(messages.error.INVALID_ID);
    }
    throw error;
  }
};
const addPeopleData = async person => {
  try {
    return await Person.create(person);
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw errors.BAD_REQUEST(messages.error.VALIDATION_ERROR);
    }
    throw errors.INTERNAL_SERVER(messages.error.DATABASE_WRITE_CONCERN_ERROR);
  }
};

const getAllPeople = async (req, res, next) => {
  try {
    const people = await getPeopleData();
    successHandler(res, messages.success.PEOPLE_RETRIEVED, people);
  } catch (error) {
    next(error);
  }
};

const getPerson = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const person = await getPersonData(id);
    successHandler(res, messages.success.PERSON_RETRIEVED, person);
  } catch (error) {
    next(error);
  }
};

const addPerson = async (req, res, next) => {
  try {
    const { name, username, email } = req.body;

    if (!name || !username || !email) {
      return next(errors.BAD_REQUEST(messages.error.REQUIRED_FIELDS));
    }
    const newPerson = { name, username, email };
    const createdPerson = await addPeopleData(newPerson);
    successHandler(res, messages.success.PERSON_ADDED, createdPerson, 201);
  } catch (error) {
    next(error);
  }
};
export { getAllPeople, getPerson, addPerson };
