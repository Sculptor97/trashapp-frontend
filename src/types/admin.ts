// Admin Types

export type DriverStatus = 'active' | 'inactive' | 'busy';
export type UserRole = 'user' | 'admin' | 'driver';
export type SubscriptionStatus = 'active' | 'inactive' | 'expired';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: DriverStatus;
  current_location?: {
    lat: number;
    lng: number;
  };
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export interface PickupWithUser {
  id: string;
  user_id: string;
  address: string;
  notes?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  waste_type: 'general' | 'recyclable' | 'hazardous';
  pickup_date: string;
  assigned_driver_id?: string;
  driver_name?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface AssignDriverRequest {
  pickup_id: string;
  driver_id: string;
}

export interface AssignDriverResponse {
  message: string;
  pickup: PickupWithUser;
  driver: Driver;
}

export interface DashboardStats {
  total_pickups: number;
  pending_pickups: number;
  completed_pickups: number;
  active_drivers: number;
  total_users: number;
}

export interface UpdatePickupStatusRequest {
  pickupId: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    count: number;
    total_pages: number;
  };
}

export interface PaginatedPickupsResponse {
  pickups: PickupWithUser[];
  pagination: {
    current_page: number;
    count: number;
    total_pages: number;
  };
}

export interface PaginatedUsersResponse {
  users: User[];
  pagination: {
    current_page: number;
    count: number;
    total_pages: number;
  };
}

// Admin hook types
export interface AdminMutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export interface AdminQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}
