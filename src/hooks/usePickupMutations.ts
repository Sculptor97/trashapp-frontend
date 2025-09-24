import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pickupService } from '../services/pickupService';
import { pickupKeys } from '../API/queryKeys';
import { ErrorHandler } from '../lib/utils/errorHandler';
import type { PickupRequest, RecurringPickupSchedule } from '../types/pickup';

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

  const uploadPhotos = useMutation({
    mutationFn: ({ pickupId, photos }: { pickupId: string; photos: File[] }) =>
      pickupService.uploadPickupPhotos(pickupId, photos),
    onSuccess: (_, { pickupId }) => {
      queryClient.invalidateQueries({ queryKey: pickupKeys.detail(pickupId) });
      ErrorHandler.showSuccessToast('Photos uploaded successfully!');
    },
    onError: error => {
      ErrorHandler.handleAndShowError(error, 'Failed to upload photos');
    },
  });

  const ratePickup = useMutation({
    mutationFn: ({
      pickupId,
      rating,
      feedback,
    }: {
      pickupId: string;
      rating: number;
      feedback?: string;
    }) => pickupService.ratePickup(pickupId, rating, feedback),
    onSuccess: (_, { pickupId }) => {
      queryClient.invalidateQueries({ queryKey: pickupKeys.detail(pickupId) });
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
      ErrorHandler.showSuccessToast('Thank you for your feedback!');
    },
    onError: error => {
      ErrorHandler.handleAndShowError(error, 'Failed to submit rating');
    },
  });

  const createRecurringSchedule = useMutation({
    mutationFn: (
      data: Omit<
        RecurringPickupSchedule,
        'id' | 'user_id' | 'created_at' | 'updated_at'
      >
    ) => pickupService.createRecurringSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pickupKeys.my() });
      ErrorHandler.showSuccessToast('Recurring schedule created successfully!');
    },
    onError: error => {
      ErrorHandler.handleAndShowError(
        error,
        'Failed to create recurring schedule'
      );
    },
  });

  const contactDriver = useMutation({
    mutationFn: ({
      pickupId,
      message,
    }: {
      pickupId: string;
      message: string;
    }) => pickupService.contactDriver(pickupId, message),
    onSuccess: () => {
      ErrorHandler.showSuccessToast('Message sent to driver!');
    },
    onError: error => {
      ErrorHandler.handleAndShowError(error, 'Failed to contact driver');
    },
  });

  return {
    requestPickup,
    cancelPickup,
    updatePickup,
    uploadPhotos,
    ratePickup,
    createRecurringSchedule,
    contactDriver,
  };
};
