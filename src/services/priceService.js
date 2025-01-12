import fetch from 'node-fetch';
import { Price } from '../models/Price.js';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';
const COINS = ['bitcoin', 'matic-network', 'ethereum'];

export async function fetchAndStorePrices() {
  try {
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${COINS.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
    );
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const pricePromises = COINS.map(coinId => {
      const coinData = data[coinId];
      return Price.create({
        coinId,
        price: coinData.usd,
        marketCap: coinData.usd_market_cap,
        change24h: coinData.usd_24h_change
      });
    });

    await Promise.all(pricePromises);
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

export async function getLatestPrice(coinId) {
  try {
    const latestPrice = await Price.findOne({ coinId }).sort({ timestamp: -1 });
    if (!latestPrice) {
      throw new Error('No price data found');
    }
    return latestPrice;
  } catch (error) {
    console.error('Error getting latest price:', error);
    throw error;
  }
}

export async function calculatePriceDeviation(coinId) {
  try {
    console.log(`Calculating deviation for ${coinId}...`);
    
    const prices = await Price.find({ coinId })
      .sort({ timestamp: -1 })
      .limit(100)
      .select('price timestamp');

    if (!prices || prices.length === 0) {
      throw new Error(`No price data available for ${coinId}`);
    }

    console.log(`Found ${prices.length} price records`);
    console.log('Sample of prices:', prices.slice(0, 3));

    const priceValues = prices.map(p => p.price);
    
    // Calculate mean
    const mean = priceValues.reduce((sum, price) => sum + price, 0) / priceValues.length;
    console.log('Mean price:', mean);

    // Calculate variance
    const squaredDifferences = priceValues.map(price => {
      const difference = price - mean;
      return difference * difference;
    });
    
    const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / priceValues.length;
    console.log('Variance:', variance);

    // Calculate standard deviation
    const standardDeviation = Math.sqrt(variance);
    console.log('Standard deviation:', standardDeviation);

    // Round to 2 decimal places
    const roundedDeviation = Number(standardDeviation.toFixed(2));
    console.log('Rounded deviation:', roundedDeviation);

    return roundedDeviation;
  } catch (error) {
    console.error('Error calculating deviation:', error);
    throw new Error(`Failed to calculate deviation: ${error.message}`);
  }
}