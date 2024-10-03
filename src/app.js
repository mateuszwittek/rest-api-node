import express from 'express';
import cors from 'cors';
import peopleRouter from './routes/peopleRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);
app.use(errorHandler);

export default app;
