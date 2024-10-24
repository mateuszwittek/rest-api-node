import { IAddPersonData, IGetPeopleData, IGetPersonData } from '../types/types';
import Person from '../models/person.js';
import messages from '../utils/messages.js';
import {
  NotFoundError,
  BadRequestError,
  DuplicateEntryError,
  DatabaseError,
} from '../errors/customErrors.js';

const getPeopleData: IGetPeopleData = async () => {
  try {
    return await Person.find({}, { _id: 0 });
  } catch (error) {
    if (error instanceof Error && error.name === 'MongoError') {
      throw DatabaseError('Failed to fetch people', error);
    }
    throw new Error(messages.error.UNKNOWN_TYPE, { cause: error as Error });
  }
};

const getPersonData: IGetPersonData = async param => {
  try {
    if (!param) {
      throw BadRequestError(messages.error.BAD_REQUEST);
    }

    const person = await Person.findOne({
      $or: [{ email: param }, { username: param }],
    });

    if (!person) {
      throw NotFoundError('person');
    }

    return person;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'NotFoundError' || error.name === 'BadRequestError')
    ) {
      throw error;
    }
    throw new Error(messages.error.UNKNOWN_TYPE, { cause: error as Error });
  }
};

const addPeopleData: IAddPersonData = async person => {
  try {
    const { name, username, email } = person;

    if (!name || !username || !email) {
      throw BadRequestError(messages.error.REQUIRED_FIELDS);
    }

    const existingPerson = await Person.findOne({
      $or: [{ email }, { username }],
    });

    if (existingPerson) {
      throw DuplicateEntryError('person');
    }

    return await Person.create(person);
  } catch (error) {
    if (error instanceof Error) {
      if (['BadRequestError', 'DuplicateEntryError'].includes(error.name)) {
        throw error;
      }
      if ((error as any).code === 11000) {
        throw DuplicateEntryError('person');
      }
    }
    throw new Error(messages.error.UNKNOWN_TYPE, { cause: error as Error });
  }
};

export { getPeopleData, getPersonData, addPeopleData };
