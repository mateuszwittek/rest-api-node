import {
  IPerson,
  IAddPersonData,
  IGetPeopleData,
  IGetPersonData,
  IUpdatePersonData,
  IDeletePersonData,
} from '../types/types';
import Person from '../models/person.js';
import messages from '../utils/messages.js';
import {
  NotFoundError,
  BadRequestError,
  DatabaseError,
  DuplicateEntryError,
} from '../errors/customErrors.js';

// Reusable query for finding a person by email or username
const personQuery = (param: string) => ({
  $or: [{ email: param }, { username: param }],
});

const findPersonByParam = async (param: string) => {
  if (!param) {
    throw BadRequestError(messages.error.BAD_REQUEST);
  }

  const person = await Person.findOne(personQuery(param));
  if (!person) {
    throw NotFoundError('person');
  }

  return person;
};

const getPeopleData: IGetPeopleData = async () => {
  try {
    // Use lean() for better performance when we don't need mongoose document methods
    return await Person.find({}, { _id: 0 }).lean();
  } catch (error) {
    if (error instanceof Error && error.name === 'MongoError') {
      throw DatabaseError('Failed to fetch people', error);
    }
    throw error;
  }
};

const getPersonData: IGetPersonData = async param => {
  return await findPersonByParam(param);
};

const addPeopleData: IAddPersonData = async ({ name, username, email, ...rest }) => {
  if (!name || !username || !email) {
    throw BadRequestError(messages.error.REQUIRED_FIELDS);
  }

  try {
    return await Person.create({ name, username, email, ...rest });
  } catch (error) {
    if (error instanceof Error && (error as any).code === 11000) {
      throw DuplicateEntryError('person');
    }
    throw error;
  }
};

const updatePersonData: IUpdatePersonData = async (param, updateData) => {
  if (Object.keys(updateData).length === 0) {
    throw BadRequestError(messages.error.BAD_REQUEST);
  }

  const person = await Person.findOneAndUpdate(
    personQuery(param),
    { $set: updateData },
    {
      new: true,
      runValidators: true,
      lean: true,
    }
  );

  if (!person) {
    throw NotFoundError('person');
  }

  return person;
};

const deletePersonData: IDeletePersonData = async param => {
  const person = await Person.findOneAndDelete(personQuery(param));

  if (!person) {
    throw NotFoundError('person');
  }

  return person;
};

export { getPeopleData, getPersonData, addPeopleData, updatePersonData, deletePersonData };
