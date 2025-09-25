import React from 'react';
import {
  Package,
  RefreshCw,
  AlertTriangle,
  Timer,
  Truck,
  CheckCircle,
  X,
  Navigation,
} from 'lucide-react';
import type { PickupStatus, WasteType } from '@/types/pickup';

// Enhanced status mapping with colors and icons
export const statusConfig: Record<
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

export const wasteTypeConfig: Record<
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
