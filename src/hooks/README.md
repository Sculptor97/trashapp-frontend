# TrashTrack Hooks Layer

This directory contains **organized React hooks** that wrap the class-based service layer with TanStack Query for state management, caching, and synchronization.

## Structure

### Organized Hook Architecture

- `useAuthMutations.ts` - **Auth mutation hooks** (login, register, logout, etc.)
- `useAuthQueries.ts` - **Auth query hooks** (profile, etc.)
- `usePickupMutations.ts` - **Pickup mutation hooks** (request, cancel, update)
- `usePickupQueries.ts` - **Pickup query hooks** (my pickups, by ID)
- `useAdminMutations.ts` - **Admin mutation hooks** (assign driver, update status)
- `useAdminQueries.ts` - **Admin query hooks** (all pickups, stats, drivers)
- `index.ts` - Exports all organized hooks

## Usage

### Authentication Hooks

```typescript
import { useAuthMutations, useAuthQueries } from '../hooks';

function LoginForm() {
  // Organized hook usage
  const { login, logout, register } = useAuthMutations();
  const { profile } = useAuthQueries();

  const handleLogin = (credentials) => {
    login.mutate(credentials, {
      onSuccess: () => {
        console.log('Login successful!');
      },
      onError: (error) => {
        console.error('Login failed:', error);
      },
    });
  };

  return (
    <div>
      {login.isPending && <p>Logging in...</p>}
      {login.isError && <p>Error: {login.error.message}</p>}
      {profile.isLoading && <p>Loading profile...</p>}
      {profile.data && <p>Welcome, {profile.data.name}!</p>}
    </div>
  );
}
```

### Pickup Hooks

```typescript
import { usePickupMutations, usePickupQueries } from '../hooks';

function PickupRequest() {
  // Organized hook usage
  const { requestPickup, cancelPickup } = usePickupMutations();
  const { myPickups, getPickupById } = usePickupQueries();

  const handleRequestPickup = (data) => {
    requestPickup.mutate(data);
  };

  return (
    <div>
      {myPickups.isLoading && <p>Loading pickups...</p>}
      {myPickups.data?.map(pickup => (
        <div key={pickup.id}>
          <p>{pickup.address}</p>
          <button onClick={() => cancelPickup.mutate(pickup.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Admin Hooks

```typescript
import { useAdminMutations, useAdminQueries } from '../hooks';

function AdminDashboard() {
  // Organized hook usage
  const { assignDriver, updatePickupStatus } = useAdminMutations();
  const { getAllPickups, getDashboardStats } = useAdminQueries();

  // Get data from queries
  const { data: allPickups } = getAllPickups();
  const { data: stats } = getDashboardStats();

  const handleAssignDriver = (pickupId, driverId) => {
    assignDriver.mutate({ pickupId, driverId });
  };

  return (
    <div>
      <h2>Dashboard Stats</h2>
      {stats && (
        <div>
          <p>Total Pickups: {stats.total_pickups}</p>
          <p>Pending: {stats.pending_pickups}</p>
        </div>
      )}

      <h2>All Pickups</h2>
      {allPickups?.pickups.map(pickup => (
        <div key={pickup.id}>
          <p>{pickup.address}</p>
          <button onClick={() => handleAssignDriver(pickup.id, 'driver-1')}>
            Assign Driver
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Hook Organization Benefits

### Separation of Concerns

- **Mutations** handle data modifications (POST, PUT, DELETE)
- **Queries** handle data fetching (GET)
- Clear separation makes code more maintainable

### Consistent API

- All mutation hooks return the same structure: `{ mutation1, mutation2, ... }`
- All query hooks return the same structure: `{ query1, query2, ... }`
- Predictable hook usage across the application

### Better Performance

- Queries can be called conditionally with parameters
- Mutations are only created when needed
- Reduced bundle size through better tree-shaking

## Hook Features

### Automatic Caching

- Queries are automatically cached and shared across components
- Stale data is refetched based on configured intervals
- Cache invalidation happens automatically on mutations

### Loading States

- `isLoading` - Initial loading state for queries
- `isPending` - Mutation is in progress
- `isError` - Error state
- `error` - Error object with details

### Optimistic Updates

- Mutations automatically invalidate related queries
- UI updates immediately while API calls are in progress
- Automatic rollback on errors

### Callbacks

- `onSuccess` - Called when mutation succeeds
- `onError` - Called when mutation fails
- `onSettled` - Called when mutation completes (success or error)

## Query Keys

Each hook uses structured query keys for efficient caching:

```typescript
// Auth
authKeys.profile(); // ['auth', 'profile']

// Pickups
pickupKeys.my(); // ['pickups', 'my']
pickupKeys.detail(id); // ['pickups', 'detail', id]

// Admin
adminKeys.pickups(params); // ['admin', 'pickups', params]
adminKeys.stats(); // ['admin', 'stats']
```

## Hook Categories

### Mutation Hooks

- **useAuthMutations**: login, register, logout, refreshToken, verifyEmail, resetPassword, changePassword
- **usePickupMutations**: requestPickup, cancelPickup, updatePickup
- **useAdminMutations**: assignDriver, updatePickupStatus

### Query Hooks

- **useAuthQueries**: profile
- **usePickupQueries**: myPickups, getPickupById
- **useAdminQueries**: getAllPickups, getAllDrivers, getDashboardStats, getPickupDetails, getAllUsers

## Demo Component

See `../examples/ServiceHooksDemo.tsx` for a complete example of how to use all the organized hooks together.
