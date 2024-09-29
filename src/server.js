import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3001;
const app = express();

async function getPeopleData() {
    const filePath = path.resolve(__dirname, 'people', 'people-data.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
}

app.use(cors());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
})


app.get('/people', async (req, res) => {
    try {
        const peopleData = await getPeopleData();
        res.json(peopleData);
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});