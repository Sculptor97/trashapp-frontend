# TrashTrack Types Directory

This directory contains all **TypeScript type definitions** for the TrashTrack application, organized by domain for proper separation of concerns (SoC).

## Structure

```
types/
├── auth.ts          # Authentication and user-related types
├── pickup.ts        # Pickup request and management types
├── admin.ts         # Admin dashboard and management types
├── index.ts         # Central export file for all types
└── README.md        # This documentation
```

## Organization Principles

### Domain-Driven Design
Each type file corresponds to a specific business domain:
- **`auth.ts`** - User authentication, registration, profile management
- **`pickup.ts`** - Pickup requests, waste management, scheduling
- **`admin.ts`** - Administrative functions, driver management, analytics

### Separation of Concerns
- **Service types** are separate from **hook types**
- **Request types** are separate from **response types**
- **Base types** are separate from **extended types**

## Type Categories

### Authentication Types (`auth.ts`)

#### Core Auth Types
```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}
```

#### Auth Response Types
```typescript
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}
```

#### Auth Hook Types
```typescript
interface AuthMutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}
```

### Pickup Types (`pickup.ts`)

#### Core Pickup Types
```typescript
type WasteType = 'general' | 'recyclable' | 'hazardous';
type PickupStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

interface Pickup {
  id: string;
  user_id: string;
  address: string;
  notes?: string;
  status: PickupStatus;
  waste_type: WasteType;
  pickup_date: string;
  assigned_driver_id?: string;
  driver_name?: string;
  created_at: string;
  updated_at: string;
}
```

#### Pickup Request Types
```typescript
interface PickupRequest {
  address: string;
  notes?: string;
  pickup_date?: string;
  waste_type?: WasteType;
}
```

### Admin Types (`admin.ts`)

#### Core Admin Types
```typescript
type DriverStatus = 'active' | 'inactive' | 'busy';
type UserRole = 'user' | 'admin' | 'driver';
type SubscriptionStatus = 'active' | 'inactive' | 'expired';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  current_location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
}
```

#### Dashboard Types
```typescript
interface DashboardStats {
  total_pickups: number;
  pending_pickups: number;
  completed_pickups: number;
  active_drivers: number;
  total_users: number;
}
```

#### Pagination Types
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    count: number;
    total_pages: number;
  };
}
```

## Usage

### Importing Types

```typescript
// Import specific types
import type { LoginCredentials, UserProfile } from '../types';

// Import all types from a domain
import type * as AuthTypes from '../types/auth';

// Import from central index
import type { Pickup, PickupStatus, Driver } from '../types';
```

### Type Safety Benefits

1. **IntelliSense Support** - Full autocomplete for all properties
2. **Compile-time Validation** - Catch type errors before runtime
3. **Refactoring Safety** - Rename properties across the entire codebase
4. **Documentation** - Types serve as living documentation

### Best Practices

1. **Use Union Types** for status fields:
   ```typescript
   type PickupStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
   ```

2. **Make Optional Fields Explicit**:
   ```typescript
   interface UserProfile {
     phone?: string;  // Optional field
     address?: string; // Optional field
   }
   ```

3. **Extend Base Types** for specialized use cases:
   ```typescript
   interface PickupWithUser extends Pickup {
     user: {
       id: string;
       name: string;
       email: string;
     };
   }
   ```

4. **Use Generic Types** for reusable patterns:
   ```typescript
   interface PaginatedResponse<T> {
     data: T[];
     pagination: Pagination;
   }
   ```

## Integration with Services and Hooks

### Service Layer Integration
```typescript
// services/authService.ts
import type { LoginCredentials, AuthResponse } from '../types';

export class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Implementation
  }
}
```

### Hook Layer Integration
```typescript
// hooks/useAuthMutations.ts
import type { LoginCredentials, AuthMutationCallbacks } from '../types';

export const useAuthMutations = () => {
  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    // ...
  });
};
```

## Type Evolution

When adding new types:

1. **Add to appropriate domain file** (auth.ts, pickup.ts, admin.ts)
2. **Export from index.ts** for easy importing
3. **Update service methods** to use new types
4. **Update hook implementations** if needed
5. **Update documentation** in this README

## Benefits of This Organization

1. **Maintainability** - Easy to find and update related types
2. **Scalability** - New domains can be added without affecting existing code
3. **Team Collaboration** - Clear ownership and organization
4. **Type Safety** - Comprehensive type coverage across the application
5. **Developer Experience** - Better IntelliSense and error messages
