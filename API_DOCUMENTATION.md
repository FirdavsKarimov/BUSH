# Eco Bonus API Integration

This document describes the integration between the Korzinka Eco App frontend and the backend API.

## API Base URL
```
http://77.93.152.199:8088
```

## API Documentation
Full API documentation available at: http://77.93.152.199:8088/docs

---

## Endpoints

### 1. GET /api/users/{user_id_string}/balance
**Description:** Get user's eco bonus point balance

**Parameters:**
- `user_id_string` (path, required): User identifier string

**Response (200 - Success):**
```json
{
  "user_id_string": "string",
  "balance": 0
}
```

**Usage in App:**
- Displayed on the Home page
- Shows total eco points earned by the user

---

### 2. GET /api/users/{user_id_string}/history
**Description:** Get user's return/recycling history

**Parameters:**
- `user_id_string` (path, required): User identifier string

**Response (200 - Success):**
```json
[
  {
    "item_name": "string",
    "location_name": "string",
    "points_awarded": 0,
    "date": "2025-11-04T08:06:54.390Z"
  }
]
```

**Usage in App:**
- Displayed on the Home page as transaction history
- Shows all recycling activities with points earned

---

### 3. GET /api/catalog
**Description:** Get catalog of recyclable items

**Response (200 - Success):**
```json
[
  {
    "item_sku": "string",
    "name": "string",
    "description": "string",
    "points_awarded": 0
  }
]
```

**Usage in App:**
- Displayed on the Catalogue page
- Shows available recyclable items and their point values

---

### 4. GET /api/locations
**Description:** Get store/recycling center locations

**Response (200 - Success):**
```json
[
  {
    "id": 0,
    "name": "string",
    "address": "string",
    "latitude": 0,
    "longitude": 0
  }
]
```

**Usage in App:**
- Displayed on the Locations page
- Shows interactive map with all store/recycling center locations

---

### 5. POST /api/returns
**Description:** Register a product return/recycling (Регистрирует возврат товара и начисляет бонусы)

**Request Body (required):**
```json
{
  "user_id_string": "string",
  "item_sku": "string"
}
```

**Response (200 - Success):**
```json
{
  "status": "string",
  "message": "string"
}
```

**Usage in App:**
- Called from the Scanner page when a barcode is scanned
- Registers the recycling activity and awards points

---

## Authentication

The app uses a simple user ID system:
- User ID is generated on first app load
- Stored in browser's localStorage
- Automatically included in all API requests

See `src/utils/auth.ts` for implementation details.

---

## Error Handling

All API calls include error handling with fallback to demo data if the API is unavailable:
- Network errors are caught and logged
- User-friendly error messages are displayed
- Demo/mock data is shown to maintain app functionality

---

## TypeScript Types

All API response types are defined in `src/utils/api.ts`:

```typescript
// Balance response
interface Balance {
  user_id_string: string;
  balance: number;
}

// History item
interface HistoryItem {
  item_name: string;
  location_name: string;
  points_awarded: number;
  date: string; // ISO 8601 format
}

// Catalog item
interface CatalogItem {
  item_sku: string;
  name: string;
  description: string;
  points_awarded: number;
}

// Location
interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Return request
interface ReturnRequest {
  user_id_string: string;
  item_sku: string;
}

// Return response
interface ReturnResponse {
  status: string;
  message: string;
}
```

---

## Testing the API

You can test the API directly using the interactive Swagger UI at:
http://77.93.152.199:8088/docs

This allows you to:
- Try out each endpoint
- See request/response examples
- Test with different parameters
- View validation errors

---

## Development

To run the app locally:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open browser at:
   ```
   http://localhost:3221
   ```

The app will automatically connect to the API at `http://77.93.152.199:8088`.

