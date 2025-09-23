import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import type { PaginationParams } from '../types';

// Query keys
export const adminKeys = {
  all: ['admin'] as const,
  pickups: (params?: PaginationParams) => [...adminKeys.all, 'pickups', params] as const,
  drivers: () => [...adminKeys.all, 'drivers'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  users: (params?: PaginationParams) => [...adminKeys.all, 'users', params] as const,
  pickupDetail: (id: string) => [...adminKeys.all, 'pickup', id] as const,
};

// Admin Query Hooks
export const useAdminQueries = () => {
  const getAllPickups = (params?: PaginationParams) => {
    return useQuery({
      queryKey: adminKeys.pickups(params),
      queryFn: () => adminService.getAllPickups(params),
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  };

  const getAllDrivers = useQuery({
    queryKey: adminKeys.drivers(),
    queryFn: () => adminService.getAllDrivers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getDashboardStats = useQuery({
    queryKey: adminKeys.stats(),
    queryFn: () => adminService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const getPickupDetails = (pickupId: string) => {
    return useQuery({
      queryKey: adminKeys.pickupDetail(pickupId),
      queryFn: () => adminService.getPickupDetails(pickupId),
      enabled: !!pickupId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  const getAllUsers = (params?: PaginationParams) => {
    return useQuery({
      queryKey: adminKeys.users(params),
      queryFn: () => adminService.getAllUsers(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    getAllPickups,
    getAllDrivers,
    getDashboardStats,
    getPickupDetails,
    getAllUsers,
  };
};
