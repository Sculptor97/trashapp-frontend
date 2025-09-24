import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { usePickupQueries } from '@/hooks/usePickupQueries';
import {
  Navigation,
  MapPin,
  Truck,
  Clock,
  Phone,
  MessageCircle,
  CheckCircle,
  Timer,
  Route,
  Zap,
  X,
} from 'lucide-react';
import type { Pickup } from '@/types/pickup';

interface PickupTrackerProps {
  pickup: Pickup;
  className?: string;
}

interface TrackingUpdate {
  id: string;
  timestamp: string;
  status: string;
  message: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

// Mock tracking data - in real app this would come from WebSocket or polling
const mockTrackingUpdates: TrackingUpdate[] = [
  {
    id: '1',
    timestamp: '2024-01-15T14:30:00Z',
    status: 'driver_assigned',
    message: 'Driver John Smith has been assigned to your pickup',
  },
  {
    id: '2',
    timestamp: '2024-01-15T14:45:00Z',
    status: 'driver_departed',
    message: 'Driver has left the depot and is heading to your location',
    location: {
      lat: 4.0483,
      lng: 9.7043,
      address: 'EcoCollect Depot, Douala',
    },
  },
  {
    id: '3',
    timestamp: '2024-01-15T15:15:00Z',
    status: 'driver_nearby',
    message: 'Driver is 5 minutes away from your location',
    location: {
      lat: 4.05,
      lng: 9.705,
      address: 'Near Main Street, Douala',
    },
  },
];

export function PickupTracker({ pickup, className }: PickupTrackerProps) {
  // Use real-time tracking data from the service
  const { usePickupTracking } = usePickupQueries();
  const trackingData = usePickupTracking(pickup.id);

  // Fallback to mock data if service data is not available
  const [trackingUpdates] = useState<TrackingUpdate[]>(
    trackingData.data?.status_updates?.map(update => ({
      id: update.id,
      timestamp: update.timestamp,
      status: update.status,
      message: update.message,
      location: update.location
        ? {
            lat: update.location.latitude,
            lng: update.location.longitude,
            address: update.location.address || 'Unknown location',
          }
        : undefined,
    })) || mockTrackingUpdates
  );
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    lastUpdate: string;
  } | null>(
    trackingData.data?.current_location
      ? {
          lat: trackingData.data.current_location.latitude,
          lng: trackingData.data.current_location.longitude,
          lastUpdate: trackingData.data.current_location.last_updated,
        }
      : {
          lat: 4.05,
          lng: 9.705,
          lastUpdate: new Date().toISOString(),
        }
  );

  // Update tracking data when service data changes
  useEffect(() => {
    if (trackingData.data) {
      if (trackingData.data.status_updates) {
        // Update tracking updates from service
        // Note: In a real app, this would be handled by React Query's automatic updates
      }
      if (trackingData.data.current_location) {
        setDriverLocation({
          lat: trackingData.data.current_location.latitude,
          lng: trackingData.data.current_location.longitude,
          lastUpdate: trackingData.data.current_location.last_updated,
        });
      }
    }
  }, [trackingData.data]);

  // Simulate real-time updates only if no service data is available
  useEffect(() => {
    if (pickup.status !== 'in_progress' && pickup.status !== 'assigned') return;
    if (trackingData.data?.current_location) return; // Don't simulate if we have real data

    const interval = setInterval(() => {
      // Simulate driver location updates only as fallback
      if (driverLocation) {
        setDriverLocation(prev =>
          prev
            ? {
                ...prev,
                lat: prev.lat + (Math.random() - 0.5) * 0.001,
                lng: prev.lng + (Math.random() - 0.5) * 0.001,
                lastUpdate: new Date().toISOString(),
              }
            : null
        );
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [pickup.status, driverLocation, trackingData.data]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'driver_assigned':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'driver_departed':
        return <Navigation className="h-4 w-4 text-purple-500" />;
      case 'driver_nearby':
        return <Zap className="h-4 w-4 text-orange-500" />;
      case 'pickup_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const estimatedArrival = () => {
    if (pickup.status === 'in_progress') {
      const arrival = new Date();
      arrival.setMinutes(
        arrival.getMinutes() + Math.floor(Math.random() * 30) + 5
      );
      return arrival.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return null;
  };

  if (pickup.status === 'pending') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-yellow-500" />
            Pickup Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Timer className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Waiting for Driver Assignment
            </h3>
            <p className="text-muted-foreground mb-4">
              We're finding the best driver for your pickup. You'll receive an
              update soon.
            </p>
            <Badge
              variant="outline"
              className="bg-yellow-50 text-yellow-700 border-yellow-200"
            >
              Estimated assignment: Within 2 hours
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (pickup.status === 'completed' || pickup.status === 'cancelled') {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {pickup.status === 'completed' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
            Pickup {pickup.status === 'completed' ? 'Completed' : 'Cancelled'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            {pickup.status === 'completed' ? (
              <>
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Pickup Completed Successfully!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for using EcoCollect. Your waste has been collected
                  and processed.
                </p>
              </>
            ) : (
              <>
                <X className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Pickup Cancelled</h3>
                <p className="text-muted-foreground mb-4">
                  This pickup request has been cancelled. You can schedule a new
                  one anytime.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-brand-primary" />
            Live Tracking
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Driver Info */}
        {pickup.driver_name && (
          <div className="flex items-center justify-between p-4 bg-brand-light/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-medium">{pickup.driver_name}</div>
                <div className="text-sm text-muted-foreground">
                  Your assigned driver
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Estimated Arrival */}
        {pickup.status === 'in_progress' && (
          <div className="flex items-center justify-between p-4 border-2 border-brand-primary/20 rounded-lg bg-brand-primary/5">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-brand-primary" />
              <div>
                <div className="font-medium">Estimated Arrival</div>
                <div className="text-sm text-muted-foreground">
                  Driver is on the way
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-brand-primary">
                {estimatedArrival()}
              </div>
              <div className="text-sm text-muted-foreground">ETA</div>
            </div>
          </div>
        )}

        {/* Current Location */}
        {driverLocation && pickup.status === 'in_progress' && (
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Driver Location
              {trackingData.data?.current_location && (
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              )}
            </h3>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Current Position</div>
                  <div className="text-sm text-muted-foreground">
                    Last updated {formatRelativeTime(driverLocation.lastUpdate)}
                    {trackingData.data?.current_location && (
                      <span className="ml-2 text-green-600">• Real-time</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Route className="h-4 w-4 mr-2" />
                  View Map
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="space-y-3">
          <h3 className="font-semibold">Tracking Updates</h3>
          {trackingData.isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">
                Loading tracking data...
              </span>
            </div>
          )}
          {trackingData.isError && (
            <div className="text-center py-4 text-red-600">
              <p className="text-sm">Failed to load tracking data</p>
              <p className="text-xs text-muted-foreground">
                Using cached information
              </p>
            </div>
          )}
          <div className="space-y-4">
            {(trackingData.data?.status_updates || trackingUpdates).map(
              (update: any, index: number) => (
                <div key={update.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(update.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{update.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatRelativeTime(update.timestamp)}
                    </div>
                    {update.location && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        {update.location.address}
                      </div>
                    )}
                  </div>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs">
                      Latest
                    </Badge>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <Separator />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex-1">
            <Route className="h-4 w-4 mr-2" />
            View on Map
          </Button>

          {pickup.driver_name && (
            <Button variant="outline" className="flex-1">
              <Phone className="h-4 w-4 mr-2" />
              Call Driver
            </Button>
          )}

          <Button variant="outline" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
