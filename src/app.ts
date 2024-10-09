import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import peopleRouter from './routes/peopleRoutes.js';
import { createError, errorHandler } from './utils/errorHandler.js';
import messages from './utils/messages.js';

const app: express.Application = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(messages.error.BAD_REQUEST, 400));
});

app.use(errorHandler);

export default app;
