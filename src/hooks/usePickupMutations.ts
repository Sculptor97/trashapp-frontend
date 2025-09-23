import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pickupService } from '../services/pickupService';
import { pickupKeys } from '../API/queryKeys';
import { ErrorHandler } from '../lib/utils/errorHandler';
import type { PickupRequest } from '../types';

// Pickup Mutation Hooks
export const usePickupMutations = () => {
  const queryClient = useQueryClient();

  const requestPickup = useMutation({
    mutationFn: (data: PickupRequest) => pickupService.requestPickup(data),
    onSuccess: () => {
      // Invalidate and refetch user's pickups
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
      ErrorHandler.showSuccessToast('Pickup requested successfully!');
    },
    onError: error => {
      ErrorHandler.handleAndShowError(error, 'Failed to request pickup');
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
