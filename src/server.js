import express from 'express';
import cors from 'cors';

const PORT = 3001;
const app = express();

app.use(cors());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});