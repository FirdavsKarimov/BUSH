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

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

The app connects to the API at `http://77.93.152.199:8088`

API endpoints:
- `GET /balance` - Get user balance
- `GET /transactions` - Get transaction history
- `GET /products` - Get product catalogue
- `GET /locations` - Get store locations
- `POST /scan` - Scan barcode

All requests include a generated user ID in the `X-User-Id` header.

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

## License

This project is for demonstration and educational purposes.

## Support

For issues or questions, please contact the development team.


