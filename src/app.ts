import express, { Application } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import peopleRouter from './routes/peopleRoutes.js';
import { errorHandler } from './utils/errorHandler.js';

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);
app.use(errorHandler);

export default app;
