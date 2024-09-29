import express from 'express';
import cors from 'cors';
import {getFileData} from "./utils/getFileData.js";

const PORT = 3001;
const app = express();

app.use(cors());

app.get('/hello', (req, res) => {
    res.json('Hello World!');
})

app.get('/people', async (req, res) => {
    try {
        const peopleData = await getFileData('people-data', 'people', 'people-data.json');
        res.json(peopleData);
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});