import rateLimit, { MemoryStore } from 'express-rate-limit';
import { config } from '../config/global.config.js';

export const limiterStore = new MemoryStore();

export const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: limiterStore,
  skip: () => config.env === 'test',
});
