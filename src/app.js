import express from 'express';
import cors from 'cors';
import peopleRouter from './routes/peopleRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);

export default app;
