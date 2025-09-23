import { useQuery } from '@tanstack/react-query';
import { pickupService } from '../services/pickupService';

// Query keys
export const pickupKeys = {
  all: ['pickups'] as const,
  my: () => [...pickupKeys.all, 'my'] as const,
  detail: (id: string) => [...pickupKeys.all, 'detail', id] as const,
};

// Pickup Query Hooks
export const usePickupQueries = () => {
  const myPickups = useQuery({
    queryKey: pickupKeys.my(),
    queryFn: () => pickupService.getMyPickups(),
    enabled: !!pickupService, // Only fetch if service is available
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const getPickupById = (pickupId: string) => {
    return useQuery({
      queryKey: pickupKeys.detail(pickupId),
      queryFn: () => pickupService.getPickupById(pickupId),
      enabled: !!pickupId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  return {
    myPickups,
    getPickupById,
  };
};
