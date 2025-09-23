import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pickupService } from '../services/pickupService';
import { pickupKeys } from './usePickupQueries';
import type { PickupRequest } from '../types';

// Pickup Mutation Hooks
export const usePickupMutations = () => {
  const queryClient = useQueryClient();

  const requestPickup = useMutation({
    mutationFn: (data: PickupRequest) => pickupService.requestPickup(data),
    onSuccess: () => {
      // Invalidate and refetch user's pickups
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
    },
  });

  const cancelPickup = useMutation({
    mutationFn: (pickupId: string) => pickupService.cancelPickup(pickupId),
    onSuccess: (_, pickupId) => {
      // Invalidate specific pickup and user's pickups list
      queryClient.invalidateQueries({ queryKey: pickupKeys.detail(pickupId) });
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
    },
  });

  const updatePickup = useMutation({
    mutationFn: ({
      pickupId,
      data,
    }: {
      pickupId: string;
      data: Partial<PickupRequest>;
    }) => pickupService.updatePickup(pickupId, data),
    onSuccess: (_, { pickupId }) => {
      // Invalidate specific pickup and user's pickups list
      queryClient.invalidateQueries({ queryKey: pickupKeys.detail(pickupId) });
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
    },
  });

  return {
    requestPickup,
    cancelPickup,
    updatePickup,
  };
};
