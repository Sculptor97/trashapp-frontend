import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Package,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type:
    | 'pickup_scheduled'
    | 'pickup_assigned'
    | 'pickup_in_progress'
    | 'pickup_completed'
    | 'pickup_cancelled'
    | 'driver_message';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  pickupId?: string;
}

interface NotificationDropdownProps {
  className?: string;
}

// Mock notifications - in real app, this would come from an API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'pickup_scheduled',
    title: 'Pickup Scheduled',
    message:
      'Your pickup request #123456 has been scheduled for tomorrow at 2:00 PM',
    timestamp: '2 hours ago',
    isRead: false,
    pickupId: '123456',
  },
  {
    id: '2',
    type: 'pickup_assigned',
    title: 'Driver Assigned',
    message: 'Driver John Doe has been assigned to your pickup request',
    timestamp: '1 day ago',
    isRead: false,
    pickupId: '123456',
  },
  {
    id: '3',
    type: 'pickup_in_progress',
    title: 'Pickup In Progress',
    message: 'Your driver is on the way to collect your waste',
    timestamp: '2 days ago',
    isRead: true,
    pickupId: '123456',
  },
  {
    id: '4',
    type: 'pickup_completed',
    title: 'Pickup Completed',
    message:
      'Your pickup has been completed successfully. Please rate your experience.',
    timestamp: '3 days ago',
    isRead: true,
    pickupId: '123456',
  },
];

const notificationConfig = {
  pickup_scheduled: {
    icon: <Clock className="h-4 w-4 text-blue-600" />,
    color: 'bg-blue-100 text-blue-800',
  },
  pickup_assigned: {
    icon: <Truck className="h-4 w-4 text-green-600" />,
    color: 'bg-green-100 text-green-800',
  },
  pickup_in_progress: {
    icon: <Package className="h-4 w-4 text-orange-600" />,
    color: 'bg-orange-100 text-orange-800',
  },
  pickup_completed: {
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    color: 'bg-green-100 text-green-800',
  },
  pickup_cancelled: {
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
    color: 'bg-red-100 text-red-800',
  },
  driver_message: {
    icon: <Bell className="h-4 w-4 text-purple-600" />,
    color: 'bg-purple-100 text-purple-800',
  },
};

export function NotificationDropdown({ className }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const formatTime = (timestamp: string) => {
    return timestamp;
  };

  return (
    <div className={cn('relative', className)}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 top-12 z-20 w-80">
            <Card className="shadow-lg border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => {
                      const config = notificationConfig[notification.type];

                      return (
                        <div key={notification.id}>
                          <div
                            className={cn(
                              'p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                              !notification.isRead && 'bg-blue-50/50'
                            )}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {config.icon}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-sm font-medium truncate">
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {notification.message}
                                </p>

                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    {formatTime(notification.timestamp)}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={cn('text-xs', config.color)}
                                  >
                                    {notification.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {index < notifications.length - 1 && <Separator />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
