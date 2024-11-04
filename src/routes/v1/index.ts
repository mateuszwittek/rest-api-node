import express from 'express';
import { peopleRouter } from './people.routes.js';

export const router = express.Router();

router.use('/v1/people', peopleRouter);
