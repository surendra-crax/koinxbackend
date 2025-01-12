import express from 'express';
import { calculatePriceDeviation } from '../services/priceService.js';

export const deviationRouter = express.Router();

deviationRouter.get('/', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ 
        error: `Invalid coin parameter. Must be one of: bitcoin, matic-network, ethereum. Received: ${coin}` 
      });
    }

    console.log(`Processing deviation request for ${coin}`);
    const deviation = await calculatePriceDeviation(coin);
    
    console.log(`Deviation calculated for ${coin}:`, deviation);
    res.json({ deviation });
  } catch (error) {
    console.error('Error in deviation route:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: 'Failed to calculate price deviation' 
    });
  }
});