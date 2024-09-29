import express from 'express';
import cors from 'cors';
import fs from 'node:fs/promises';
import nodeCache from 'node-cache';
import path from 'node:path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cache = new nodeCache();
const PORT = 3001;
const app = express();

function saveToCache(key, file){
    cache.set(key, file);
}

function getFromCache(key){
    if (cache.has(key)) {
        return cache.get(key);
    }
}

function validJSON(str){
    try {
        return JSON.parse(str);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log('File content is not a valid JSON string');
        } else {
            console.error('An error occurred:', error);
        }
        console.log('not valid json returned');
        return false;
    }
}

async function getFile(...paths) {
    const filePath = path.resolve(__dirname, ...paths);
    const fileName = path.parse(filePath).name;

    try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const value = validJSON(fileContent) || fileContent;
        saveToCache(fileName, value);
        return value;
    } catch (error) {
        throw new Error('Error reading file');
    }
}

async function getPeopleData() {
    if(getFromCache('people-data')){
        return getFromCache('people-data');
    }
    return await getFile('people', 'people-data.json');
}

app.use(cors());

app.get('/hello', (req, res) => {
    res.json('Hello World!');
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