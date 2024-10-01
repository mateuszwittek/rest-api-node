import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { getFileData } from './utils/getFileData.js';

const PORT = 3001;
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());

app.get('/hello', (req, res) => {
  res.json('Hello World!');
});

app.get('/people', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '/people/people-data.json');
    const peopleData = await getFileData(filePath);
    res.json(peopleData);
  } catch (error) {
    res.status(500).send(`Error reading file: ${error}`);
  }
});

app.get('/people/:id', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '/people/people-data.json');
    const peopleData = await getFileData(filePath);
    const person = peopleData.find(person => person.id === Number(req.params.id));
    if (!person) {
      res.status(404).send('Person not found');
    } else {
      res.json(person);
    }
  } catch (error) {
    res.status(500).send(`Error reading file: ${error}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
