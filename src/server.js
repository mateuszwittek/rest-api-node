import express from 'express';
import cors from 'cors';

const port = 3001;
let app = express();
app.use(cors());
app.get('/hello', (req, res) => {
    res.send('Hello World!');
})
app.listen(port, () => {
  console.info(`Server is listening on port ${port}`);
}).on('error', (error) => {
  console.error(`Error occurred while starting server on port ${port}: ${error.message}`);
});