import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PickupRequestForm } from '@/components/forms/PickupRequestForm';
import { PickupDetailModal } from '@/components/modals/PickupDetailModal';
import { RatingModal } from '@/components/modals/RatingModal';
import { PickupTracker } from '@/components/tracking/PickupTracker';
import { useConfirmDialog } from '@/components/ConfirmDialog';
import { usePickupQueries } from '@/hooks/usePickupQueries';
import { usePickupMutations } from '@/hooks/usePickupMutations';
import { cn } from '@/lib/utils';
import {
  Package,
  Calendar,
  Plus,
  X,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import {
  StatsCards,
  RequestFilters,
  RequestList,
  QuickActions,
  getTimeSlotHour,
} from './components';
import type { Pickup, PickupStatus, WasteType } from '@/types/pickup';

interface RequestFilters {
  status: PickupStatus | 'all';
  wasteType: WasteType | 'all';
  dateRange: 'all' | 'week' | 'month';
  searchQuery: string;
}

export default function DashboardRequests() {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Pickup | null>(null);
  const [editingRequest, setEditingRequest] = useState<Pickup | null>(null);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    pickupId: string | null;
    pickupDetails: { wasteType: string; address: string; date: string } | null;
  }>({
    isOpen: false,
    pickupId: null,
    pickupDetails: null,
  });
  const [filters, setFilters] = useState<RequestFilters>({
    status: 'all',
    wasteType: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  // Debounced search to avoid too many API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [filters.searchQuery]);

  // Hooks for data fetching and mutations
  const { useMyPickupsWithFilters, usePickupStats, useRecurringSchedules } =
    usePickupQueries();
  const {
    requestPickup,
    cancelPickup,
    updatePickup,
    uploadPhotos,
    ratePickup,
    contactDriver,
  } = usePickupMutations();

  // Convert filters to backend format
  const backendFilters = useMemo(
    () => ({
      status: filters.status !== 'all' ? filters.status : undefined,
      waste_type: filters.wasteType !== 'all' ? filters.wasteType : undefined,
      date_range: filters.dateRange !== 'all' ? filters.dateRange : undefined,
      search_query: debouncedSearchQuery || undefined,
    }),
    [filters.status, filters.wasteType, filters.dateRange, debouncedSearchQuery]
  );

  // Fetch pickups with backend filtering
  const myPickups = useMyPickupsWithFilters(backendFilters);

  // Additional data hooks
  const pickupStats = usePickupStats();
  const recurringSchedules = useRecurringSchedules();

  // Confirm dialog
  const { showConfirm, ConfirmDialog } = useConfirmDialog();

  // Find active pickup for tracking
  const activePickup = useMemo(() => {
    return myPickups.data?.find(
      p => p.status === 'assigned' || p.status === 'in_progress'
    );
  }, [myPickups.data]);

  // Note: Real-time tracking data is handled internally by PickupTracker component
  // Backend filtering is now handled by the API, no need for client-side filtering

  // Use service stats or fallback to manual calculation
  const stats = useMemo(() => {
    if (pickupStats.data) {
      return {
        total: pickupStats.data.total_requests,
        pending: pickupStats.data.pending_requests,
        scheduled: pickupStats.data.scheduled_requests,
        completed: pickupStats.data.completed_requests,
        thisMonth: pickupStats.data.completed_requests, // Using completed as this month proxy
      };
    }

    // Fallback to manual calculation using filtered data from backend
    const pickups = myPickups.data || [];
    const thisMonth = pickups.filter(p => {
      const pickupDate = new Date(p.pickup_date);
      const now = new Date();
      return (
        pickupDate.getMonth() === now.getMonth() &&
        pickupDate.getFullYear() === now.getFullYear()
      );
    });

    return {
      total: pickups.length,
      pending: pickups.filter(p => p.status === 'pending').length,
      scheduled: pickups.filter(p => p.status === 'assigned').length,
      completed: thisMonth.filter(p => p.status === 'completed').length,
      thisMonth: thisMonth.length,
    };
  }, [pickupStats.data, myPickups.data]);

  // Handle new pickup request
  const handleNewRequest = async (data: any) => {
    try {
      const pickupData = {
        address: data.address,
        coordinates: data.coordinates,
        pickup_date: `${data.pickupDate}T${getTimeSlotHour(data.pickupTime)}:00:00`,
        pickup_time: data.pickupTime,
        waste_type: data.wasteType,
        estimated_weight: data.estimatedWeight,
        urgent_pickup: data.urgentPickup,
        recurring_pickup: data.recurringPickup,
        recurring_frequency: data.recurringFrequency,
        special_instructions: data.notes,
        notes: data.notes,
      };

      const response = await requestPickup.mutateAsync(pickupData);

      // Upload photos if any
      if (data.photos && data.photos.length > 0 && response.pickup.id) {
        try {
          await uploadPhotos.mutateAsync({
            pickupId: response.pickup.id,
            photos: data.photos,
          });
        } catch (photoError) {
          console.error('Failed to upload photos:', photoError);
          // Don't fail the entire request if photo upload fails
        }
      }

      setShowNewRequestForm(false);
    } catch (error) {
      console.error('Failed to create pickup request:', error);
    }
  };

  // Handle pickup cancellation
  const handleCancelPickup = (pickupId: string) => {
    showConfirm({
      title: 'Cancel Pickup',
      description:
        'Are you sure you want to cancel this pickup? This action cannot be undone.',
      variant: 'destructive',
      confirmText: 'Cancel Pickup',
      cancelText: 'Keep Pickup',
      onConfirm: async () => {
        try {
          await cancelPickup.mutateAsync(pickupId);
        } catch (error) {
          console.error('Failed to cancel pickup:', error);
        }
      },
    });
  };

  // Handle pickup editing
  const handleEditPickup = (pickup: Pickup) => {
    setEditingRequest(pickup);
    setShowNewRequestForm(false);
    setSelectedRequest(null);
  };

  // Handle pickup update
  const handleUpdatePickup = async (data: any) => {
    if (!editingRequest) return;

    try {
      const updateData = {
        address: data.address,
        coordinates: data.coordinates,
        pickup_date: `${data.pickupDate}T${getTimeSlotHour(data.pickupTime)}:00:00`,
        pickup_time: data.pickupTime,
        waste_type: data.wasteType,
        estimated_weight: data.estimatedWeight,
        urgent_pickup: data.urgentPickup,
        recurring_pickup: data.recurringPickup,
        recurring_frequency: data.recurringFrequency,
        special_instructions: data.notes,
        notes: data.notes,
      };

      await updatePickup.mutateAsync({
        pickupId: editingRequest.id,
        data: updateData,
      });

      // Upload photos if any
      if (data.photos && data.photos.length > 0) {
        try {
          await uploadPhotos.mutateAsync({
            pickupId: editingRequest.id,
            photos: data.photos,
          });
        } catch (photoError) {
          console.error('Failed to upload photos:', photoError);
        }
      }

      setEditingRequest(null);
    } catch (error) {
      console.error('Failed to update pickup:', error);
    }
  };

  // Handle driver contact
  const handleContactDriver = (driverName: string, pickupId?: string) => {
    const message = prompt(`Send a message to ${driverName}:`);
    if (message && pickupId) {
      showConfirm({
        title: 'Send Message',
        description: `Send this message to ${driverName}: "${message}"`,
        variant: 'info',
        confirmText: 'Send Message',
        cancelText: 'Cancel',
        onConfirm: async () => {
          try {
            await contactDriver.mutateAsync({
              pickupId,
              message,
            });
          } catch (error) {
            console.error('Failed to contact driver:', error);
          }
        },
      });
    }
  };

  // Handle pickup rating
  const handleRatePickup = (pickupId: string) => {
    const pickup = myPickups.data?.find(p => p.id === pickupId);
    if (pickup) {
      setRatingModal({
        isOpen: true,
        pickupId,
        pickupDetails: {
          wasteType: pickup.waste_type,
          address: pickup.address,
          date: new Date(pickup.pickup_date).toLocaleDateString(),
        },
      });
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async (rating: number, feedback?: string) => {
    if (ratingModal.pickupId) {
      try {
        await ratePickup.mutateAsync({
          pickupId: ratingModal.pickupId,
          rating,
          feedback,
        });
        setRatingModal({ isOpen: false, pickupId: null, pickupDetails: null });
      } catch (error) {
        console.error('Failed to rate pickup:', error);
      }
    }
  };

  if (showNewRequestForm || editingRequest) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">
              {editingRequest ? 'Edit Pickup Request' : 'New Pickup Request'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {editingRequest
                ? 'Update your pickup request details.'
                : 'Schedule a new waste pickup with our professional team.'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setShowNewRequestForm(false);
              setEditingRequest(null);
            }}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <PickupRequestForm
          onSubmit={editingRequest ? handleUpdatePickup : handleNewRequest}
          isLoading={
            editingRequest ? updatePickup.isPending : requestPickup.isPending
          }
          {...(editingRequest && { initialData: editingRequest })}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary">
            Pickup Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your waste pickup requests.
          </p>
        </div>
        <Button
          className="bg-brand-primary hover:bg-brand-secondary w-full sm:w-auto"
          onClick={() => setShowNewRequestForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Active Pickup Tracking */}
      {activePickup && (
        <div className="grid gap-4 md:grid-cols-1">
          <PickupTracker pickup={activePickup} />
        </div>
      )}

      {/* Recurring Schedules */}
      {recurringSchedules.data && recurringSchedules.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Recurring Schedules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recurringSchedules.data.map(schedule => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {schedule.frequency} pickup
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.waste_type} • {schedule.address}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {schedule.is_active ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pickup History</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => myPickups.refetch()}
                disabled={myPickups.isFetching}
              >
                <RefreshCw
                  className={cn(
                    'h-4 w-4',
                    myPickups.isFetching && 'animate-spin'
                  )}
                />
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filter Controls */}
          <RequestFilters filters={filters} onFiltersChange={setFilters} />

          {/* Loading State */}
          {myPickups.isLoading && (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-brand-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading your requests...
              </span>
            </div>
          )}

          {/* Error State */}
          {myPickups.isError && (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-6 w-6 mr-2" />
              <span>Failed to load pickup requests. Please try again.</span>
            </div>
          )}

          {/* Empty State */}
          {myPickups.data &&
            myPickups.data.length === 0 &&
            !myPickups.isLoading && (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filters.searchQuery ||
                  filters.status !== 'all' ||
                  filters.wasteType !== 'all'
                    ? 'No requests match your filters'
                    : 'No pickup requests yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {filters.searchQuery ||
                  filters.status !== 'all' ||
                  filters.wasteType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by scheduling your first waste pickup.'}
                </p>
                {!filters.searchQuery &&
                  filters.status === 'all' &&
                  filters.wasteType === 'all' && (
                    <Button
                      className="bg-brand-primary hover:bg-brand-secondary"
                      onClick={() => setShowNewRequestForm(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule First Pickup
                    </Button>
                  )}
              </div>
            )}

          {/* Pickup Requests List */}
          {myPickups.data && myPickups.data.length > 0 && (
            <RequestList
              requests={myPickups.data}
              onViewRequest={setSelectedRequest}
              onEditRequest={handleEditPickup}
              onCancelRequest={handleCancelPickup}
              onContactDriver={handleContactDriver}
              onRateRequest={handleRatePickup}
              isCancelling={cancelPickup.isPending}
            />
          )}

          {/* Pagination */}
          {myPickups.data && myPickups.data.length > 10 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(myPickups.data.length, 10)} of{' '}
                {myPickups.data.length} requests
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <QuickActions onSchedulePickup={() => setShowNewRequestForm(true)} />

      {/* Pickup Detail Modal */}
      {selectedRequest && (
        <PickupDetailModal
          pickup={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onCancel={handleCancelPickup}
          onContactDriver={driverName => {
            handleContactDriver(driverName, selectedRequest?.id);
          }}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() =>
          setRatingModal({ isOpen: false, pickupId: null, pickupDetails: null })
        }
        onSubmit={handleRatingSubmit}
        isLoading={ratePickup.isPending}
        pickupDetails={ratingModal.pickupDetails || undefined}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog />
    </div>
  );
}
