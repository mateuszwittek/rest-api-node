import { getFileData } from '../utils/getFileData.js';
import { modifyFile } from '../utils/modifyFile.js';
import { getFileDir } from '../utils/getFileDir.js';
import { generateNewID } from '../utils/generateNewID.js';

const peopleFilePath = getFileDir('/people-data.json');

const getPeopleData = async () => {
  try {
    return await getFileData(peopleFilePath);
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
};

const modifyPeopleData = async data => {
  try {
    await modifyFile(peopleFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error writing to file: ${error.message}`);
  }
};
const getAllPeople = async (req, res) => {
  try {
    const people = await getPeopleData();
    res.json(people);
  } catch (error) {
    res.status(500).send(`Error reading file: ${error}`);
  }
};
const getPersonByID = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).send('ID must be a number');
  }

  try {
    const people = await getPeopleData();
    const person = people.find(person => person.id === id);

    if (!person) {
      return res.status(404).send('Person not found');
    }

    res.json(person);
  } catch (error) {
    res.status(500).send(`Error reading data: ${error}`);
  }
};

const addPerson = async (req, res) => {
  const { name, username, email } = req.body;

  if (!name || !username || !email) {
    return res.status(400).send('Name, username, and email are required');
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
    res.status(500).send(`Error writing to file: ${error.message}`);
  }
};

export { getAllPeople, getPersonByID, addPerson };
