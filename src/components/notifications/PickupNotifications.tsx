import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bell, CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  pickupId?: string;
  isRead: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface PickupNotificationsProps {
  className?: string;
  maxVisible?: number;
}

// Mock notifications - in real app this would come from WebSocket or API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Driver Assigned',
    message: 'John Smith has been assigned to your pickup request #REQ-001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    pickupId: 'REQ-001',
    isRead: false,
    actionLabel: 'View Details',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Driver Running Late',
    message: 'Your pickup is delayed by 15 minutes due to traffic',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    pickupId: 'REQ-002',
    isRead: false,
    actionLabel: 'Track Driver',
  },
  {
    id: '3',
    type: 'success',
    title: 'Pickup Completed',
    message: 'Your recyclable waste has been successfully collected',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    pickupId: 'REQ-003',
    isRead: true,
    actionLabel: 'View Receipt',
  },
  {
    id: '4',
    type: 'info',
    title: 'Pickup Reminder',
    message: 'Your scheduled pickup is tomorrow at 10:00 AM',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    pickupId: 'REQ-004',
    isRead: true,
  },
];

export function PickupNotifications({
  className,
  maxVisible = 5,
}: PickupNotificationsProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get notification icon and color
  const getNotificationConfig = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200',
        };
      case 'error':
        return {
          icon: <X className="h-4 w-4" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200',
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200',
        };
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  // Dismiss notification
  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Format relative time
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

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const visibleNotifications = isExpanded
    ? notifications
    : notifications.slice(0, maxVisible);

  return (
    <Card className={cn('w-full', className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="font-medium">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-brand-primary text-white">
                {unreadCount}
              </Badge>
            )}
          </div>

          {notifications.length > maxVisible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : `Show All (${notifications.length})`}
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-auto">
          {visibleNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {visibleNotifications.map(notification => {
                const config = getNotificationConfig(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 hover:bg-muted/50 transition-colors',
                      !notification.isRead && 'bg-blue-50/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('mt-0.5', config.color)}>
                        {config.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {notification.title}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {formatRelativeTime(notification.timestamp)}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>

                        {notification.actionLabel && (
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                notification.onAction?.();
                                markAsRead(notification.id);
                              }}
                            >
                              {notification.actionLabel}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
