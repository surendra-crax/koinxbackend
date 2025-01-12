import express from 'express';
import { getLatestPrice, fetchAndStorePrices } from '../services/priceService.js';

export const statsRouter = express.Router();

// Add new route to manually trigger price fetch
statsRouter.post('/fetch', async (req, res) => {
  try {
    console.log('Manually triggering price fetch...');
    await fetchAndStorePrices();
    console.log('Price fetch completed successfully');
    res.json({ message: 'Prices fetched and stored successfully' });
  } catch (error) {
    console.error('Error in manual price fetch:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

statsRouter.get('/', async (req, res) => {
  try {
    const { coin } = req.query;
    
    if (!coin || !['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin parameter' });
    }

    const latestPrice = await getLatestPrice(coin);
    
    if (!latestPrice) {
      return res.status(404).json({ error: 'No price data available' });
    }

    res.json({
      price: latestPrice.price,
      marketCap: latestPrice.marketCap,
      "24hChange": latestPrice.change24h
    });
  } catch (error) {
    console.error('Error in stats route:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});