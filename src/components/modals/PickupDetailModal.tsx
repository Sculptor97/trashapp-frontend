import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Package,
  Calendar,
  MapPin,
  Truck,
  Phone,
  MessageCircle,
  Navigation,
  X,
  CheckCircle,
  Timer,
  AlertCircle,
  Download,
} from 'lucide-react';
import type { Pickup, PickupStatus, WasteType } from '@/types/pickup';

interface PickupDetailModalProps {
  pickup: Pickup;
  onClose: () => void;
  onCancel?: (pickupId: string) => void;
  onEdit?: (pickup: Pickup) => void;
  onContactDriver?: (driverName: string) => void;
  isOpen: boolean;
}

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
    icon: <Timer className="h-4 w-4" />,
    description: 'Waiting for driver assignment',
  },
  assigned: {
    label: 'Assigned',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <Truck className="h-4 w-4" />,
    description: 'Driver assigned, pickup scheduled',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: <Navigation className="h-4 w-4" />,
    description: 'Driver is on the way or collecting',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle className="h-4 w-4" />,
    description: 'Pickup completed successfully',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: <X className="h-4 w-4" />,
    description: 'Pickup was cancelled',
  },
};

const wasteTypeConfig: Record<
  WasteType,
  {
    label: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  }
> = {
  general: {
    label: 'General Waste',
    icon: <Package className="h-6 w-6 text-gray-600" />,
    color: 'bg-gray-100 text-gray-800',
    description: 'Regular household and office waste',
  },
  recyclable: {
    label: 'Recyclable Materials',
    icon: <CheckCircle className="h-6 w-6 text-green-600" />,
    color: 'bg-green-100 text-green-800',
    description: 'Items that can be recycled',
  },
  hazardous: {
    label: 'Hazardous Waste',
    icon: <AlertCircle className="h-6 w-6 text-red-600" />,
    color: 'bg-red-100 text-red-800',
    description: 'Items requiring special handling',
  },
};

export function PickupDetailModal({
  pickup,
  onClose,
  onCancel,
  onEdit,
  onContactDriver,
  isOpen,
}: PickupDetailModalProps) {
  if (!isOpen) return null;

  const statusInfo = statusConfig[pickup.status];
  const wasteInfo = wasteTypeConfig[pickup.waste_type];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                {wasteInfo.icon}
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Pickup Request #{pickup.id.slice(-6)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {wasteInfo.description}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Section */}
          <div className="space-y-3">
            <h3 className="font-semibold">Status</h3>
            <div className="flex items-center gap-3">
              <Badge className={cn('px-3 py-1', statusInfo.color)}>
                {statusInfo.icon}
                <span className="ml-2">{statusInfo.label}</span>
              </Badge>
              <span className="text-sm text-muted-foreground">
                {statusInfo.description}
              </span>
            </div>
          </div>

          <Separator />

          {/* Pickup Details */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pickup Details</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{wasteInfo.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {wasteInfo.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {formatDate(pickup.pickup_date)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(pickup.pickup_date)} •{' '}
                      {getRelativeTime(pickup.pickup_date)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Pickup Address</div>
                    <div className="text-sm text-muted-foreground">
                      {pickup.address}
                    </div>
                  </div>
                </div>

                {pickup.driver_name && (
                  <div className="flex items-center gap-3">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Assigned Driver</div>
                      <div className="text-sm text-muted-foreground">
                        {pickup.driver_name}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {pickup.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Special Instructions
                </h3>
                <div className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm">{pickup.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Timeline */}
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Request Created</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(pickup.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {pickup.status !== 'pending' && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Driver Assigned</div>
                    <div className="text-xs text-muted-foreground">
                      {pickup.driver_name} •{' '}
                      {new Date(pickup.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {pickup.status === 'completed' && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pickup Completed</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(pickup.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {pickup.status === 'cancelled' && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Pickup Cancelled</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(pickup.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <Separator />
          <div className="flex flex-wrap gap-3">
            {pickup.status === 'pending' && onEdit && (
              <Button variant="outline" onClick={() => onEdit(pickup)}>
                <Package className="h-4 w-4 mr-2" />
                Edit Request
              </Button>
            )}

            {(pickup.status === 'pending' || pickup.status === 'assigned') &&
              onCancel && (
                <Button variant="outline" onClick={() => onCancel(pickup.id)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel Pickup
                </Button>
              )}

            {pickup.driver_name &&
              pickup.status === 'assigned' &&
              onContactDriver && (
                <Button
                  variant="outline"
                  onClick={() => onContactDriver(pickup.driver_name!)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Driver
                </Button>
              )}

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>

            <Button variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Track Location
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
