import { getFileData } from '../utils/getFileData.js';
import { modifyFile } from '../utils/modifyFile.js';
import { getFileDir } from '../utils/getFileDir.js';
import { generateNewID } from '../utils/generateNewID.js';
import { messages, errors } from '../utils/errorHandler.js';

const peopleFilePath = getFileDir('/people-data.json');

const getPeopleData = async () => {
  try {
    return await getFileData(peopleFilePath);
  } catch (error) {
    throw errors.INTERNAL_SERVER(messages.error.READING_FILE);
  }
};

const modifyPeopleData = async data => {
  try {
    await modifyFile(peopleFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw errors.INTERNAL_SERVER(messages.error.WRITING_FILE);
  }
};

const getAllPeople = async (req, res, next) => {
  try {
    const people = await getPeopleData();
    res.json(people);
  } catch (error) {
    next(error);
  }
};

const getPersonByID = async (req, res, next) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return next(errors.BAD_REQUEST(messages.error.INVALID_ID));
  }

  try {
    const people = await getPeopleData();
    const person = people.find(person => person.id === id);

    if (!person) {
      return next(errors.NOT_FOUND(messages.error.PERSON_NOT_FOUND));
    }

    res.json(person);
  } catch (error) {
    next(error);
  }
};

const addPerson = async (req, res, next) => {
  const { name, username, email } = req.body;

  if (!name || !username || !email) {
    return next(errors.BAD_REQUEST(messages.error.REQUIRED_FIELDS));
  }

  try {
    const people = await getPeopleData();
    const newPerson = {
      id: generateNewID(people),
      name,
      username,
      email,
    };
    const newPeople = [...people, newPerson];
    await modifyPeopleData(newPeople);
    res.status(201).json(newPerson);
  } catch (error) {
    next(error);
  }
};

export { getAllPeople, getPersonByID, addPerson };
