import { MongoError } from 'mongodb';
import { FilterQuery, MongooseError } from 'mongoose';
import { messages } from '../constants/messages.js';
import { Person } from '../models/person.model.js';
import {
  NotFoundError,
  BadRequestError,
  DatabaseError,
  DuplicateEntryError,
} from '../errors/customErrors.js';

const personQuery = (param: string): FilterQuery<IPerson> => ({
  $or: [{ email: param }, { username: param }],
});

const findPersonByParam = async (param: string): Promise<IPerson> => {
  if (!param) {
    throw BadRequestError(messages.error.BAD_REQUEST);
  }

  const person = await Person.findOne(personQuery(param));
  if (!person) {
    throw NotFoundError('person');
  }

  return person;
};

export const getPeopleData: IGetPeopleData = async (): Promise<IPerson[]> => {
  try {
    return await Person.find({}, { _id: 0 }).lean();
  } catch (error) {
    if (error instanceof MongoError || error instanceof MongooseError) {
      throw DatabaseError('Failed to fetch people', error);
    }
    throw error;
  }
};

export const getPersonData: IGetPersonData = async (param: string): Promise<IPerson> => {
  return await findPersonByParam(param);
};

export const addPeopleData: IAddPersonData = async ({
  name,
  username,
  email,
  ...rest
}): Promise<IPersonDocument> => {
  if (!name || !username || !email) {
    throw BadRequestError(messages.error.REQUIRED_FIELDS);
  }

  try {
    return await Person.create({ name, username, email, ...rest });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      throw DuplicateEntryError('person');
    }
    throw error;
  }
};

export const updatePersonData: IUpdatePersonData = async (param, updateData): Promise<IPerson> => {
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

export const deletePersonData: IDeletePersonData = async (param: string): Promise<IPerson> => {
  const person = await Person.findOneAndDelete(personQuery(param));

  if (!person) {
    throw NotFoundError('person');
  }

  return person;
};
