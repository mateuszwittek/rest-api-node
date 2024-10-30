import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import helmetConfig from './config/helmetConfig.js';
import corsConfig from './config/corsConfig.js';
import router from './routes/v1/index.js';
import errorHandler from './middleware/errorHandler.js';
import { NotFoundError } from './errors/customErrors.js';
import limiter from './middleware/rateLimiter.js';
import { responseSanitizer } from './utils/responseSanitizer.js';

const app: express.Application = express();

app.use(helmet(helmetConfig));
app.use(limiter);
app.use(cors(corsConfig));
app.use(express.json());

// API routes
app.use('/api', router);

// If no route matches, create 404 error
app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(NotFoundError('route'));
});

app.use(responseSanitizer);
app.use(errorHandler);

export default app;
