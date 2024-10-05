import Person from '../models/person.js';
import { errors } from '../utils/errorHandler.js';
import messages from '../utils/messages.js';

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

export { getPeopleData, getPersonData, addPeopleData };
