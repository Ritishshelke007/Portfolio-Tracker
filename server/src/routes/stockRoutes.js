import express from 'express';
import {
  getStocks,
  addStock,
  updateStock,
  deleteStock,
  
} from '../controllers/stockController.js';

const router = express.Router();

router.route('/')
  .get(getStocks)
  .post(addStock);

router.route('/:id')
  .put(updateStock)
  .delete(deleteStock);

export default router;
