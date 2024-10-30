import rateLimit from 'express-rate-limit';
import config from '../config/config.js';

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

export default limiter;
