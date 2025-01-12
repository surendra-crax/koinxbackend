import express from 'express';
import mongoose from 'mongoose';
import cron from 'node-cron';
import { fetchAndStorePrices } from './services/priceService.js';
import { statsRouter } from './routes/stats.js';
import { deviationRouter } from './routes/deviation.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schedule background job to run every 2 hours
cron.schedule('0 */2 * * *', async () => {
  console.log('Running scheduled price fetch...');
  try {
    await fetchAndStorePrices();
    console.log('Price fetch completed successfully');
  } catch (error) {
    console.error('Error in scheduled price fetch:', error);
  }
});

// Routes
app.use('/stats', statsRouter);
app.use('/deviation', deviationRouter);

// Initial price fetch on startup
fetchAndStorePrices().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});