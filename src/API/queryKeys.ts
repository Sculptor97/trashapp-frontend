import type { PaginationParams } from './types/api';

// Base query key factory
const createQueryKey = (domain: string, ...keys: (string | number | object | undefined)[]) => {
  return [domain, ...keys.filter(key => key !== undefined)] as const;
};

// Auth query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => createQueryKey('auth', 'profile'),
  user: (id: string) => createQueryKey('auth', 'user', id),
};

// Pickup query keys
export const pickupKeys = {
  all: ['pickups'] as const,
  my: () => createQueryKey('pickups', 'my'),
  detail: (id: string) => createQueryKey('pickups', 'detail', id),
  byStatus: (status: string) => createQueryKey('pickups', 'status', status),
  byUser: (userId: string) => createQueryKey('pickups', 'user', userId),
};

// Admin query keys
export const adminKeys = {
  all: ['admin'] as const,
  pickups: (params?: PaginationParams) => createQueryKey('admin', 'pickups', params),
  drivers: () => createQueryKey('admin', 'drivers'),
  stats: () => createQueryKey('admin', 'stats'),
  users: (params?: PaginationParams) => createQueryKey('admin', 'users', params),
  pickupDetail: (id: string) => createQueryKey('admin', 'pickup', id),
  dashboard: () => createQueryKey('admin', 'dashboard'),
};

// Combined query keys for easy access
export const queryKeys = {
  auth: authKeys,
  pickup: pickupKeys,
  admin: adminKeys,
} as const;
