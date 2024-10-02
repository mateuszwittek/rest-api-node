import express from 'express';
import cors from 'cors';
import { getAllPeople } from './controllers/peopleController.js';
import { getFileData } from './utils/getFileData.js';
import { modifyFile } from './utils/modifyFile.js';
import { generateNewID } from './utils/generateNewID.js';
import { getFileDir } from './utils/getFileDir.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/hello', (req, res) => {
  res.json('Hello World!');
});

app.get('/people', async (req, res) => {
  try {
    const people = await getAllPeople();
    res.json(people);
  } catch (error) {
    res.status(500).send(`Error reading file: ${error}`);
  }
});

app.get('/people/:id', async (req, res) => {
  try {
    const people = await getAllPeople();
    const person = people.find(person => person.id === Number(req.params.id));
    if (!person) {
      res.status(404).send('Person not found');
    } else {
      res.json(person);
    }
  } catch (error) {
    res.status(500).send(`Error reading file: ${error}`);
  }
});

app.post('/people', async (req, res) => {
  const { name, username, email } = req.body;
  const filePath = getFileDir('/people/people-data.json');
  if (!name || !username || !email) {
    return res.status(400).send('Name, username, and email are required');
  }
  try {
    const data = await getFileData(filePath);
    const newPerson = { id: generateNewID(data), name, username, email };
    const newPeople = [...data, newPerson];
    await modifyFile(filePath, JSON.stringify(newPeople, null, 2));
    res.status(201).json(newPerson);
  } catch (error) {
    res.status(500).send(`Error writing to file: ${error.message}`);
  }
});

export default app;
