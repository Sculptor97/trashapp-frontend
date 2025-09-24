import { useQuery } from '@tanstack/react-query';
import { pickupService } from '../services/pickupService';
import { pickupKeys } from '../API/queryKeys';
import type { PickupFilters } from '../types/pickup';

// Pickup Query Hooks
export const usePickupQueries = () => {
  const myPickups = useQuery({
    queryKey: pickupKeys.my(),
    queryFn: () => pickupService.getMyPickups(),
    enabled: !!pickupService, // Only fetch if service is available
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const useMyPickupsWithFilters = (filters?: PickupFilters) => {
    return useQuery({
      queryKey: pickupKeys.my(filters),
      queryFn: () => pickupService.getMyPickups(filters),
      enabled: !!pickupService,
      staleTime: 1 * 60 * 1000, // 1 minute for filtered results
    });
  };

  const useGetPickupById = (pickupId: string) => {
    return useQuery({
      queryKey: pickupKeys.detail(pickupId),
      queryFn: () => pickupService.getPickupById(pickupId),
      enabled: !!pickupId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  const usePickupStats = () => {
    return useQuery({
      queryKey: pickupKeys.stats(),
      queryFn: () => pickupService.getPickupStats(),
      enabled: !!pickupService,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  const usePickupTracking = (pickupId: string) => {
    return useQuery({
      queryKey: pickupKeys.tracking(pickupId),
      queryFn: () => pickupService.getPickupTracking(pickupId),
      enabled: !!pickupId,
      staleTime: 30 * 1000, // 30 seconds for real-time tracking
      refetchInterval: 30 * 1000, // Refresh every 30 seconds
    });
  };

  const useRecurringSchedules = () => {
    return useQuery({
      queryKey: pickupKeys.recurring(),
      queryFn: () => pickupService.getRecurringSchedules(),
      enabled: !!pickupService,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return {
    myPickups,
    useMyPickupsWithFilters,
    useGetPickupById,
    usePickupStats,
    usePickupTracking,
    useRecurringSchedules,
  };
};
