# Cryptocurrency Price Tracker

A real-time cryptocurrency price tracking application that monitors Bitcoin, Ethereum, and Polygon (MATIC) prices. The application fetches price data from CoinGecko API every 2 hours and stores it in MongoDB for historical analysis.

## Features

- Real-time price tracking for Bitcoin, Ethereum, and MATIC
- Price deviation calculation based on last 100 records
- Automatic price updates every 2 hours
- Interactive web interface
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Internet connection for CoinGecko API access

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-price-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Get Current Price Statistics
```
GET /stats?coin={coinId}
```
- `coinId`: bitcoin, ethereum, or matic-network

Response:
```json
{
  "price": 45000.00,
  "marketCap": 800000000000,
  "24hChange": 2.5
}
```

### Get Price Deviation
```
GET /deviation?coin={coinId}
```
- `coinId`: bitcoin, ethereum, or matic-network

Response:
```json
{
  "deviation": 4082.48
}
```

### Manual Price Fetch
```
POST /stats/fetch
```

## Project Structure

```
├── public/                 # Static frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── index.js           # Application entry point
├── .env                   # Environment variables
└── package.json
```

## Deployment

### AWS Elastic Beanstalk Deployment

1. Install AWS CLI and EB CLI
2. Initialize EB project:
```bash
eb init
```

3. Create EB environment:
```bash
eb create
```

4. Deploy:
```bash
eb deploy
```

Make sure to configure the following files for AWS deployment:
- `.ebextensions/nodecommand.config`
- `Procfile`

### Local Development

1. Set up MongoDB Atlas:
   - Create a cluster
   - Get connection string
   - Add IP to whitelist
   - Update .env file

2. Start development server:
```bash
npm run dev
```

3. Access application:
   - Web Interface: http://localhost:3000
   - API: http://localhost:3000/stats?coin=bitcoin

## Tech Stack

- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Frontend: HTML, CSS, JavaScript
- APIs: CoinGecko
- Background Jobs: node-cron

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License
