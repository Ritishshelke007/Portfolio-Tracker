import express from 'express';
import { getPortfolioMetrics } from '../controllers/portfolioController.js';

const router = express.Router();

router.get('/metrics', getPortfolioMetrics);

export default router;
