# Mapbox Integration Setup

## Overview

The EcoCollect application uses Mapbox for address autocomplete, geocoding, and location services in the pickup request system.

## Setup Instructions

### 1. Get Mapbox Access Token

1. Go to [Mapbox](https://www.mapbox.com/) and create an account
2. Navigate to your account dashboard
3. Create a new access token with the following scopes:
   - `styles:read`
   - `fonts:read`
   - `datasets:read`
   - `geocoding`

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory and add:

```bash
VITE_MAPBOX_ACCESS_TOKEN=your_actual_mapbox_access_token_here
```

### 3. Features Implemented

#### Address Autocomplete

- Real-time address suggestions as you type
- Cameroon-focused search results
- Address validation with confidence scoring
- Current location detection

#### Geocoding Services

- Convert addresses to coordinates
- Reverse geocoding (coordinates to address)
- Address validation and verification
- Distance calculations

#### Enhanced Pickup Requests

- Interactive address input with autocomplete
- Visual waste type selection
- Photo upload for waste documentation
- Cost estimation based on waste type and weight
- Recurring pickup scheduling
- Real-time form validation

#### Live Tracking

- Real-time driver location updates
- Pickup status timeline
- Estimated arrival times
- Driver contact integration

## Usage Examples

### Basic Address Search

```typescript
import { mapboxService } from '@/lib/utils/mapbox';

const suggestions = await mapboxService.searchAddresses('Douala Main Street');
```

### Address Validation

```typescript
const validation = await mapboxService.validateAddress(
  '123 Main Street, Douala'
);
if (validation.isValid) {
  console.log('Coordinates:', validation.coordinates);
}
```

### Current Location

```typescript
const coordinates = await mapboxService.getCurrentLocation();
const address = await mapboxService.reverseGeocode(coordinates);
```

## Components

### AddressInput

Smart address input with autocomplete, validation, and current location detection.

### PickupRequestForm

Comprehensive form for creating pickup requests with address validation, waste type selection, and photo uploads.

### PickupTracker

Real-time tracking component showing driver location and pickup progress.

### PickupDetailModal

Detailed view of pickup requests with timeline and actions.

## Configuration

All Mapbox settings are centralized in `src/config/app.ts`:

```typescript
mapbox: {
  accessToken: 'your_token',
  defaultCenter: [9.7043, 4.0483], // Douala coordinates
  defaultZoom: 12,
  style: 'mapbox://styles/mapbox/streets-v12',
}
```

## Cameroon-Specific Features

- Search results filtered to Cameroon (CM country code)
- Major cities coordinates for proximity search
- Bilingual support (English/French)
- Local address formatting
- Distance calculations in kilometers

## Error Handling

- Graceful fallbacks when Mapbox API is unavailable
- User-friendly error messages
- Offline address input support
- Validation feedback with confidence levels

## Performance Optimizations

- Debounced search requests (300ms)
- Request caching and deduplication
- Lazy loading of map components
- Optimized suggestion rendering
