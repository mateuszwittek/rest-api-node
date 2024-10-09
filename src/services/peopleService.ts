import { IAddPersonData, IGetPeopleData, IGetPersonData } from '../types/types';
import Person from '../models/person.js';
import { createError } from '../middleware/errorHandler.js';
import messages from '../utils/messages.js';

const getPeopleData: IGetPeopleData = async () => {
  try {
    return await Person.find({}, { _id: 0 });
  } catch (error) {
    throw error;
  }
};

const getPersonData: IGetPersonData = async param => {
  try {
    const person = await Person.findOne({ $or: [{ email: param }, { username: param }] });
    if (!person) {
      throw createError(messages.error.PERSON_NOT_FOUND, 404);
    }
    return person;
  } catch (error) {
    throw error;
  }
};

const addPeopleData: IAddPersonData = async person => {
  try {
    const { name, username, email } = person;
    if (!name || !username || !email) {
      throw createError(messages.error.REQUIRED_FIELDS, 400);
    }
    return await Person.create(person);
  } catch (error) {
    throw error;
  }
};

export { getPeopleData, getPersonData, addPeopleData };
