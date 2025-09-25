import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Timer,
  MapPin,
  Truck,
  MessageCircle,
  Eye,
  Edit,
  X,
  Phone,
  Star,
  Package,
} from 'lucide-react';
import { statusConfig, wasteTypeConfig } from './requestConfigs.tsx';
import { formatDate, formatTime, getRelativeTime } from './requestUtils';
import { cn } from '@/lib/utils';
import type { Pickup } from '@/types/pickup';

interface RequestListProps {
  requests: Pickup[];
  onViewRequest: (request: Pickup) => void;
  onEditRequest: (request: Pickup) => void;
  onCancelRequest: (requestId: string) => void;
  onContactDriver: (driverName: string, pickupId?: string) => void;
  onRateRequest: (requestId: string) => void;
  isCancelling?: boolean;
}

export function RequestList({
  requests,
  onViewRequest,
  onEditRequest,
  onCancelRequest,
  onContactDriver,
  onRateRequest,
  isCancelling = false,
}: RequestListProps) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {requests.map(request => {
        const statusInfo = statusConfig[request.status] || {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Timer className="h-3 w-3" />,
          description: 'Unknown status',
        };
        const wasteInfo = wasteTypeConfig[request.waste_type] || {
          label: 'Unknown Type',
          icon: <Package className="h-5 w-5 text-gray-600" />,
          color: 'bg-gray-100 text-gray-800',
        };

        return (
          <div
            key={request.id}
            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            {/* Mobile Layout */}
            <div className="flex flex-col space-y-4 md:hidden">
              {/* Header with icon and status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0">
                    {wasteInfo.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm">{wasteInfo.label}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={cn(statusInfo.color, 'text-xs')}>
                        {statusInfo.icon}
                        <span className="ml-1">{statusInfo.label}</span>
                      </Badge>
                      {request.status === 'completed' && request.rating && (
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-300 text-xs"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          {request.rating}/5
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{request.address}</span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(request.pickup_date)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(request.pickup_date)}</span>
                  </div>
                </div>

                {request.driver_name && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span>Driver: {request.driver_name}</span>
                  </div>
                )}

                {request.notes && (
                  <div className="text-xs text-muted-foreground">
                    <MessageCircle className="h-3 w-3 inline mr-1" />
                    {request.notes}
                  </div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewRequest(request)}
                    className="h-8 px-2"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>

                  {request.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditRequest(request)}
                      className="h-8 px-2"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  )}

                  {(request.status === 'pending' ||
                    request.status === 'assigned') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelRequest(request.id)}
                      disabled={isCancelling}
                      className="h-8 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}

                  {request.driver_name && request.status === 'assigned' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onContactDriver(request.driver_name!, request.id)
                      }
                      className="h-8 px-2"
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {request.status === 'completed' && (
                  <div className="flex items-center">
                    {request.rating ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={cn(
                                'h-3 w-3',
                                star <= request.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-1">
                          {request.rating}/5
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRateRequest(request.id)}
                        className="text-yellow-600 hover:text-yellow-700 h-8 px-2"
                      >
                        <Star className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center">
                  {wasteInfo.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium truncate">{wasteInfo.label}</h3>
                    <Badge className={statusInfo.color}>
                      {statusInfo.icon}
                      <span className="ml-1">{statusInfo.label}</span>
                    </Badge>
                    {request.status === 'completed' && request.rating && (
                      <Badge
                        variant="outline"
                        className="text-yellow-600 border-yellow-300"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {request.rating}/5
                      </Badge>
                    )}
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
                  onClick={() => onViewRequest(request)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                {request.status === 'pending' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRequest(request)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}

                {(request.status === 'pending' ||
                  request.status === 'assigned') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCancelRequest(request.id)}
                    disabled={isCancelling}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}

                {request.driver_name && request.status === 'assigned' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onContactDriver(request.driver_name!, request.id)
                    }
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                )}

                {request.status === 'completed' && (
                  <div className="flex items-center space-x-2">
                    {request.rating ? (
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={cn(
                                'h-4 w-4',
                                star <= request.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {request.rating}/5
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRateRequest(request.id)}
                        className="text-yellow-600 hover:text-yellow-700"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
