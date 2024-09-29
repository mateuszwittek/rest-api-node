import express from 'express';
import cors from 'cors';
import {cacheService} from "./utils/cache.js";
import {getFile} from "./utils/getFile.js";

const PORT = 3001;
const app = express();

async function getData(...pathChunks) {
    const cachedData = cacheService.getFromCache('people-data');
    if(cachedData){
        console.log('cached data return');
        return cachedData;
    }
    console.log('getfile data return');
    return await getFile(...pathChunks);
}

app.use(cors());

app.get('/hello', (req, res) => {
    res.json('Hello World!');
})


app.get('/people', async (req, res) => {
    try {
        const peopleData = await getData('people', 'people-data.json');
        res.json(peopleData);
    } catch (error) {
        res.status(500).send('Error reading file');
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});