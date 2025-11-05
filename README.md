# Korzinka Eco - Sustainable Shopping App

A modern mobile web application for sustainable product shopping, built with React, TypeScript, and Vite.

## About The Project

This application is designed to promote eco-friendly and sustainable shopping habits. The global sustainable products market is projected to grow from USD 355.3 billion (2024-2025) to USD 692 billion by 2033. This app aims to make sustainable goods more accessible and improve quality of life through green shopping practices.

## Features

- **Home Screen**: View your balance and transaction history
- **Product Catalogue**: Browse sustainable products with special offers
- **Store Locations**: Find nearby stores on an interactive map
- **Barcode Scanner**: Scan products or manually enter barcodes to get information
- **User Authentication**: Automatic user ID generation and persistence

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Axios** - API calls
- **Leaflet** - Interactive maps
- **html5-qrcode** - Barcode scanning

## Getting Started

> **⚡ Quick Start:** See [QUICKSTART.md](./QUICKSTART.md) for the fastest way to get running!

### Prerequisites

- Node.js 16+ and npm
- Docker (optional, for containerized deployment)

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open browser at: http://localhost:3221
```

### Docker Deployment

```bash
# Using Docker Compose (recommended)
npm run docker:up

# Access at: http://localhost:8080
```

For detailed Docker setup, see [DOCKER.md](./DOCKER.md)

### Production Build

```bash
npm run build
npm run preview
```

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## API Integration

The app connects to the backend API at **`https://api.bush.uz`**

### Environment Variables

Configure the API URL using environment variables:

```bash
VITE_API_BASE_URL=https://api.bush.uz
```

### API Endpoints

- `GET /api/users/{user_id_string}/balance` - Get user balance
- `GET /api/users/{user_id_string}/history` - Get transaction history
- `GET /api/catalog` - Get recyclable items catalog
- `GET /api/locations` - Get collection locations
- `POST /api/returns` - Register item return/scan

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── BottomNav.tsx # Bottom navigation
│   └── StatusBar.tsx # Status bar
├── pages/            # Page components
│   ├── HomePage.tsx      # Balance & transactions
│   ├── CataloguePage.tsx # Product catalogue
│   ├── LocationsPage.tsx # Store locations map
│   └── ScannerPage.tsx   # Barcode scanner
├── utils/            # Utility functions
│   ├── auth.ts       # Authentication
│   └── api.ts        # API service
├── App.tsx           # Main app component
├── App.css           # Global styles
└── main.tsx          # App entry point
```

## Features Detail

### Home Screen
- Displays loyalty card balance
- Shows bonus points and expiration dates
- Lists transaction history grouped by month
- Real-time balance updates

### Catalogue
- Grid view of products with images
- Original and discounted prices
- Discount percentage badges
- Order functionality

### Locations
- Interactive map powered by Leaflet
- Store markers with names and addresses
- Popup information on marker click
- Centered on Tashkent, Uzbekistan

### Scanner
- Camera-based barcode scanning
- Manual barcode entry option
- Real-time scan results
- Product information display

## Mobile-First Design

The app is optimized for mobile devices with:
- Responsive layout (max-width: 480px)
- Touch-friendly interface
- Bottom navigation for easy thumb access
- Native-like mobile experience

## Documentation

### Getting Started
- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in minutes ⚡
- **[Deployment Guide](./DEPLOYMENT.md)** - Complete production deployment guide 🚀

### Technical Reference
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoint reference
- **[Docker Setup](./DOCKER.md)** - Docker deployment guide
- **[Database Configuration](./DATABASE.md)** - PostgreSQL and pgAdmin setup 🔒
- **[Credentials Reference](./CREDENTIALS.md)** - Quick access to all credentials and URLs 🔑

⚠️ **Note:** `DATABASE.md` and `CREDENTIALS.md` contain sensitive information and are gitignored for security.

## License

This project is for demonstration and educational purposes.

## Support

For issues or questions, please contact the development team.


