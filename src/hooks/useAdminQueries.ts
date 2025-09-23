import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { adminKeys } from '../API/queryKeys';
import type { PaginationParams } from '../types';

// Admin Query Hooks
export const useAdminQueries = () => {
  const useGetAllPickups = (params?: PaginationParams) => {
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

  const useGetPickupDetails = (pickupId: string) => {
    return useQuery({
      queryKey: adminKeys.pickupDetail(pickupId),
      queryFn: () => adminService.getPickupDetails(pickupId),
      enabled: !!pickupId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  const useGetAllUsers = (params?: PaginationParams) => {
    return useQuery({
      queryKey: adminKeys.users(params),
      queryFn: () => adminService.getAllUsers(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    useGetAllPickups,
    getAllDrivers,
    getDashboardStats,
    useGetPickupDetails,
    useGetAllUsers,
  };
};
