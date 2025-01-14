# Portfolio Tracker

A real-time portfolio tracking application built with React, Node.js, Express, and MongoDB. Track your stock portfolio with live market data and visualize your investments.

## Features

- **Real-time Market Data**: Live tracking of major market indices (SENSEX, NIFTY 50, NIFTY BANK)
- **Portfolio Management**: Add, edit, and track your stock holdings
- **Portfolio Analytics**: View total investment, current value, and profit/loss metrics
- **Top Performers**: Track your best and worst performing stocks
- **Dark/Light Mode**: Customizable UI theme
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with Vite
- TailwindCSS for styling
- Heroicons for icons
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB for database
- Yahoo Finance API for market data

## Prerequisites

Before running the application, ensure you have:
- Node.js (v16 or higher)
- MongoDB installed and running
- Git for version control

## Local Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd portfolio-tracker
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Create .env file with:
   # MONGODB_URI=your_mongodb_uri
   # PORT=3000
   
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## Project Structure

```
portfolio-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/      # React context providers
│   │   └── assets/       # Static assets
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── routes/      # API routes
│   │   └── models/      # MongoDB models
```

## API Documentation

### Stock Endpoints

#### GET /api/stocks
- Get all stocks in portfolio
- Response: Array of stock objects

#### POST /api/stocks
- Add new stock to portfolio
- Body: `{ symbol, shares, buyPrice }`

#### PUT /api/stocks/:id
- Update existing stock
- Body: `{ shares, buyPrice }`

#### DELETE /api/stocks/:id
- Remove stock from portfolio

### Market Data Endpoints

#### GET /api/market/quote/:symbol
- Get real-time market data for index
- Response: `{ price, change, changePercent }`

## Deployment Guide

### Backend Deployment (Render.com)

1. Create a Render account at https://render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: portfolio-tracker-backend
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_uri
     PORT=3000
     CLIENT_URL=https://your-frontend-url.vercel.app
     ```

### Frontend Deployment (Vercel)

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Navigate to frontend directory:
   ```bash
   cd client
   ```
4. Deploy to Vercel:
   ```bash
   vercel
   ```
5. Follow the prompts and configure:
   - Set build output directory: `dist`
   - Add environment variables in Vercel dashboard:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```

### MongoDB Atlas Setup

1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Set up database access:
   - Create database user
   - Add IP access (0.0.0.0/0 for public access)
4. Get connection string and add to backend environment variables

### Post-Deployment Steps

1. Update frontend environment variables with actual backend URL
2. Update backend CORS configuration with frontend domain
3. Test all features in production environment
4. Monitor error logs in Render and Vercel dashboards

## Assumptions and Limitations

1. **Market Data**
   - Uses Yahoo Finance API with 1-minute cache
   - Limited to Indian market indices
   - Real-time data may have slight delay

2. **Portfolio Management**
   - Stocks must be added manually
   - No support for multiple portfolios
   - Basic buy/sell functionality

3. **User Experience**
   - Single user system
   - No authentication implemented
   - Local storage for theme preference

## Future Improvements

1. User authentication and multiple portfolios
2. Historical performance tracking
3. Stock search and suggestions
4. Portfolio diversification analysis
5. Export/Import portfolio data
6. Mobile app version

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning or development.
