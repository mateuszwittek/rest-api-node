import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import helmetConfig from './config/helmetConfig.js';
import corsConfig from './config/corsConfig.js';
import router from './routes/v1/index.js';
import errorHandler from './middleware/errorHandler.js';
import { NotFoundError } from './errors/customErrors.js';
import limiter from './middleware/rateLimiter.js';

const app: express.Application = express();

app.use(helmet(helmetConfig));
app.use(limiter);
app.use(cors(corsConfig));
app.use(express.json());

app.use('/api', router);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(NotFoundError('route'));
});

app.use(errorHandler);

export default app;
