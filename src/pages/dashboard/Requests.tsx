import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PickupRequestForm } from '@/components/forms/PickupRequestForm';
import { PickupDetailModal } from '@/components/modals/PickupDetailModal';
import { PickupTracker } from '@/components/tracking/PickupTracker';
import { PickupNotifications } from '@/components/notifications/PickupNotifications';
import { usePickupQueries } from '@/hooks/usePickupQueries';
import { usePickupMutations } from '@/hooks/usePickupMutations';
import { cn } from '@/lib/utils';
import {
  Package,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Eye,
  Edit,
  X,
  Search,
  Filter,
  RefreshCw,
  Truck,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Timer,
  Navigation,
  Phone,
  MessageCircle,
  Star,
} from 'lucide-react';
import type { Pickup, PickupStatus, WasteType } from '@/types/pickup';

// Enhanced status mapping with colors and icons
const statusConfig: Record<
  PickupStatus,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    description: string;
  }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: <Timer className="h-3 w-3" />,
    description: 'Waiting for driver assignment',
  },
  assigned: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Truck className="h-3 w-3" />,
    description: 'Driver assigned, pickup scheduled',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Navigation className="h-3 w-3" />,
    description: 'Driver is on the way or collecting',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-3 w-3" />,
    description: 'Pickup completed successfully',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <X className="h-3 w-3" />,
    description: 'Pickup was cancelled',
  },
};

const wasteTypeConfig: Record<
  WasteType,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
  }
> = {
  general: {
    label: 'General Waste',
    icon: <Package className="h-5 w-5 text-gray-600" />,
    color: 'bg-gray-100 text-gray-800',
  },
  recyclable: {
    label: 'Recyclable',
    icon: <RefreshCw className="h-5 w-5 text-green-600" />,
    color: 'bg-green-100 text-green-800',
  },
  hazardous: {
    label: 'Hazardous',
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    color: 'bg-red-100 text-red-800',
  },
};

interface RequestFilters {
  status: PickupStatus | 'all';
  wasteType: WasteType | 'all';
  dateRange: 'all' | 'week' | 'month';
  searchQuery: string;
}

export default function DashboardRequests() {
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Pickup | null>(null);
  const [filters, setFilters] = useState<RequestFilters>({
    status: 'all',
    wasteType: 'all',
    dateRange: 'all',
    searchQuery: '',
  });

  // Hooks for data fetching and mutations
  const { myPickups, usePickupStats, useRecurringSchedules } =
    usePickupQueries();
  const {
    requestPickup,
    cancelPickup,
    uploadPhotos,
    ratePickup,
    contactDriver,
  } = usePickupMutations();

  // Additional data hooks
  const pickupStats = usePickupStats();
  const recurringSchedules = useRecurringSchedules();

  // Find active pickup for tracking
  const activePickup = useMemo(() => {
    return myPickups.data?.find(
      p => p.status === 'assigned' || p.status === 'in_progress'
    );
  }, [myPickups.data]);

  // Note: Real-time tracking data is handled internally by PickupTracker component

  // Filter and search pickups
  const filteredPickups = useMemo(() => {
    if (!myPickups.data) return [];

    return myPickups.data.filter(pickup => {
      // Status filter
      if (filters.status !== 'all' && pickup.status !== filters.status) {
        return false;
      }

      // Waste type filter
      if (
        filters.wasteType !== 'all' &&
        pickup.waste_type !== filters.wasteType
      ) {
        return false;
      }

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          pickup.address,
          pickup.notes || '',
          pickup.driver_name || '',
          wasteTypeConfig[pickup.waste_type].label,
        ]
          .join(' ')
          .toLowerCase();

        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const pickupDate = new Date(pickup.pickup_date);
        const now = new Date();
        const daysDiff = Math.floor(
          (now.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (filters.dateRange === 'week' && daysDiff > 7) return false;
        if (filters.dateRange === 'month' && daysDiff > 30) return false;
      }

      return true;
    });
  }, [myPickups.data, filters]);

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

    // Fallback to manual calculation
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
  const handleCancelPickup = async (pickupId: string) => {
    if (window.confirm('Are you sure you want to cancel this pickup?')) {
      try {
        await cancelPickup.mutateAsync(pickupId);
      } catch (error) {
        console.error('Failed to cancel pickup:', error);
      }
    }
  };

  // Handle driver contact
  const handleContactDriver = async (driverName: string, pickupId?: string) => {
    const message = prompt(`Send a message to ${driverName}:`);
    if (message && pickupId) {
      try {
        await contactDriver.mutateAsync({
          pickupId,
          message,
        });
      } catch (error) {
        console.error('Failed to contact driver:', error);
      }
    }
  };

  // Handle pickup rating
  const handleRatePickup = async (pickupId: string) => {
    const rating = prompt('Rate this pickup (1-5 stars):');
    const feedback = prompt('Optional feedback:');

    if (rating && !isNaN(Number(rating))) {
      try {
        await ratePickup.mutateAsync({
          pickupId,
          rating: Number(rating),
          feedback: feedback || undefined,
        });
      } catch (error) {
        console.error('Failed to rate pickup:', error);
      }
    }
  };

  // Utility function to convert time slot to hour
  const getTimeSlotHour = (timeSlot: string): string => {
    switch (timeSlot) {
      case 'morning':
        return '09';
      case 'afternoon':
        return '14';
      case 'evening':
        return '17';
      default:
        return '09';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (date.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 0) {
      return `${Math.abs(diffInHours)} hours ago`;
    } else if (diffInHours < 24) {
      return `In ${diffInHours} hours`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `In ${diffInDays} days`;
    }
  };

  if (showNewRequestForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">
              New Pickup Request
            </h1>
            <p className="text-muted-foreground mt-2">
              Schedule a new waste pickup with our professional team.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowNewRequestForm(false)}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>

        <PickupRequestForm
          onSubmit={handleNewRequest}
          isLoading={requestPickup.isPending}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Pickup Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and track your waste pickup requests.
          </p>
        </div>
        <Button
          className="bg-brand-primary hover:bg-brand-secondary"
          onClick={() => setShowNewRequestForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Active Pickup Tracking */}
      {activePickup && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <PickupTracker pickup={activePickup} />
          </div>
          <PickupNotifications />
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-primary">
              {stats.total}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.scheduled}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming pickups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Completed pickups</p>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by address, notes, or driver..."
                  value={filters.searchQuery}
                  onChange={e =>
                    setFilters(prev => ({
                      ...prev,
                      searchQuery: e.target.value,
                    }))
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={filters.status}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, status: value as any }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.wasteType}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, wasteType: value as any }))
                }
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {Object.entries(wasteTypeConfig).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {config.icon}
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.dateRange}
                onValueChange={value =>
                  setFilters(prev => ({ ...prev, dateRange: value as any }))
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
            filteredPickups.length === 0 &&
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
          {filteredPickups.length > 0 && (
            <div className="space-y-4">
              {filteredPickups.map(request => {
                const statusInfo = statusConfig[request.status];
                const wasteInfo = wasteTypeConfig[request.waste_type];

                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                        {wasteInfo.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium truncate">
                            {wasteInfo.label}
                          </h3>
                          <Badge className={statusInfo.color}>
                            {statusInfo.icon}
                            <span className="ml-1">{statusInfo.label}</span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(request.pickup_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(request.pickup_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Timer className="h-3 w-3" />
                            <span>{getRelativeTime(request.pickup_date)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate max-w-xs">
                              {request.address}
                            </span>
                          </div>
                          {request.driver_name && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Truck className="h-3 w-3" />
                                <span>Driver: {request.driver_name}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {request.notes && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <MessageCircle className="h-3 w-3 inline mr-1" />
                            {request.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Action Buttons */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {request.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}

                      {(request.status === 'pending' ||
                        request.status === 'assigned') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelPickup(request.id)}
                          disabled={cancelPickup.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}

                      {request.driver_name && request.status === 'assigned' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleContactDriver(
                              request.driver_name!,
                              request.id
                            )
                          }
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      )}

                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRatePickup(request.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredPickups.length > 10 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {Math.min(filteredPickups.length, 10)} of{' '}
                {filteredPickups.length} requests
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
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setShowNewRequestForm(true)}
            >
              <div className="text-left">
                <div className="flex items-center gap-2 font-medium">
                  <Plus className="h-4 w-4" />
                  Schedule Pickup
                </div>
                <div className="text-sm text-muted-foreground">
                  Request a new waste collection
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 font-medium">
                  <RefreshCw className="h-4 w-4" />
                  Track Active
                </div>
                <div className="text-sm text-muted-foreground">
                  View ongoing pickups
                </div>
              </div>
            </Button>

            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  View Schedule
                </div>
                <div className="text-sm text-muted-foreground">
                  See upcoming pickups
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
}
