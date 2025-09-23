import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import { adminKeys } from './useAdminQueries';

// Admin Mutation Hooks
export const useAdminMutations = () => {
  const queryClient = useQueryClient();

  const assignDriver = useMutation({
    mutationFn: ({ pickupId, driverId }: { pickupId: string; driverId: string }) =>
      adminService.assignDriver(pickupId, driverId),
    onSuccess: (_, { pickupId }) => {
      // Invalidate all pickup-related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });

  const updatePickupStatus = useMutation({
    mutationFn: ({
      pickupId,
      status,
    }: {
      pickupId: string;
      status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    }) => adminService.updatePickupStatus(pickupId, status),
    onSuccess: (_, { pickupId }) => {
      // Invalidate all pickup-related queries
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });

  return {
    assignDriver,
    updatePickupStatus,
  };
};
