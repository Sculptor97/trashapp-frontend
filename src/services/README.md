# TrashTrack Service Layer

This directory contains the **class-based service layer** for the TrashTrack application, providing a clean abstraction between the frontend and backend API.

## Structure

- `authService.ts` - **AuthService class** with authentication and user management
- `pickupService.ts` - **PickupService class** with pickup request management  
- `adminService.ts` - **AdminService class** with admin dashboard functionality
- `index.ts` - Exports all service classes and types

## Architecture

### Class-Based Services

Each service is implemented as a **class** with a **singleton instance** exported:

```typescript
// Service class definition
export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Implementation
  }
}

// Singleton instance export
export const authService = new AuthService();
```

### Token Management

The `TokenManager` class handles all token operations:

```typescript
import { TokenManager } from '../services';

// Static methods for token management
TokenManager.getToken();
TokenManager.setToken(token);
TokenManager.clearTokens();
TokenManager.isAuthenticated();
```

## Usage

### Authentication Service

```typescript
import { authService } from '../services';

// Login
const response = await authService.login({ email, password });

// Register  
const response = await authService.register({ name, email, password });

// Get profile
const profile = await authService.getProfile();

// Logout
await authService.logout();

// Check authentication status
const isAuth = authService.isAuthenticated();
```

### Pickup Service

```typescript
import { pickupService } from '../services';

// Request pickup
const response = await pickupService.requestPickup({
  address: '123 Main St',
  notes: 'Please collect in the morning'
});

// Get user's pickups
const pickups = await pickupService.getMyPickups();

// Get specific pickup
const pickup = await pickupService.getPickupById(pickupId);

// Cancel pickup
await pickupService.cancelPickup(pickupId);
```

### Admin Service

```typescript
import { adminService } from '../services';

// Get all pickups with pagination
const { pickups, pagination } = await adminService.getAllPickups({
  page: 1,
  page_size: 10,
  search: 'search term'
});

// Assign driver
const response = await adminService.assignDriver(pickupId, driverId);

// Get dashboard stats
const stats = await adminService.getDashboardStats();

// Get all drivers
const drivers = await adminService.getAllDrivers();

// Update pickup status
const updatedPickup = await adminService.updatePickupStatus(pickupId, 'completed');
```

## Key Features

### Automatic Token Management
- Tokens are automatically saved to localStorage on login/register
- Tokens are automatically included in API requests via axios interceptors
- Tokens are cleared on logout
- Refresh token functionality is available

### Error Handling
All services use the centralized `ApiRequest` function which:
- Handles network errors consistently
- Provides structured error formatting
- Logs requests/responses in development mode
- Throws meaningful error messages

### Type Safety
- Full TypeScript support with interfaces
- Generic API response handling
- Proper error typing
- IntelliSense support for all methods

## Service Classes

### AuthService
- `login()` - User authentication
- `register()` - User registration
- `logout()` - User logout with token cleanup
- `getProfile()` - Get user profile
- `refreshToken()` - Refresh access token
- `verifyEmail()` - Email verification
- `resetPassword()` - Password reset
- `changePassword()` - Change password
- `isAuthenticated()` - Check auth status

### PickupService
- `requestPickup()` - Create pickup request
- `getMyPickups()` - Get user's pickups
- `getPickupById()` - Get specific pickup
- `cancelPickup()` - Cancel pickup request
- `updatePickup()` - Update pickup details

### AdminService
- `getAllPickups()` - Get all pickups with pagination
- `assignDriver()` - Assign driver to pickup
- `getAllDrivers()` - Get all drivers
- `getDashboardStats()` - Get dashboard statistics
- `updatePickupStatus()` - Update pickup status
- `getPickupDetails()` - Get pickup with user info
- `getAllUsers()` - Get all users with pagination
