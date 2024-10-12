import express from 'express';
import peopleRoutes from './peopleRoutes.js';

const router = express.Router();

router.use('/v1/people', peopleRoutes);

export default router;
