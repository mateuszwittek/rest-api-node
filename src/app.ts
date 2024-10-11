import express from 'express';
import cors from 'cors';
import peopleRouter from './routes/peopleRoutes.js';
import { createError, errorHandler } from './middleware/errorHandler.js';
import messages from './utils/messages.js';
import limiter from './middleware/rateLimiter.js';

const app: express.Application = express();

app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/people', peopleRouter);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(messages.error.NOT_FOUND, 404));
});

app.use(errorHandler);

export default app;
