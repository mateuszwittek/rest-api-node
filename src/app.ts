import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import peopleRouter from './routes/peopleRoutes.js';
import { errors, errorHandler } from './utils/errorHandler.js';

const app: express.Application = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(errors.NOT_FOUND());
});

app.use(errorHandler);

export default app;
