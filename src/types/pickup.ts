// Pickup Types

export type WasteType = 'general' | 'recyclable' | 'hazardous';
export type PickupStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface PickupRequest {
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  notes?: string;
  pickup_date: string;
  pickup_time?: 'morning' | 'afternoon' | 'evening';
  waste_type: WasteType;
  estimated_weight?: number; // in kg
  urgent_pickup?: boolean;
  recurring_pickup?: boolean;
  recurring_frequency?: 'weekly' | 'biweekly' | 'monthly';
  photos?: string[]; // Array of photo URLs/IDs
  special_instructions?: string;
}

export interface Pickup {
  id: string;
  user_id: string;
  address: string;
  coordinates?: [number, number]; // [longitude, latitude]
  notes?: string;
  status: PickupStatus;
  waste_type: WasteType;
  pickup_date: string;
  pickup_time?: 'morning' | 'afternoon' | 'evening';
  estimated_weight?: number; // in kg
  actual_weight?: number; // in kg (filled after pickup)
  urgent_pickup?: boolean;
  recurring_pickup?: boolean;
  recurring_frequency?: 'weekly' | 'biweekly' | 'monthly';
  photos?: string[]; // Array of photo URLs/IDs
  special_instructions?: string;
  assigned_driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  estimated_cost?: number; // in FCFA
  actual_cost?: number; // in FCFA (final cost)
  completion_notes?: string; // Driver notes after completion
  rating?: number; // Customer rating (1-5)
  created_at: string;
  updated_at: string;
}

export interface PickupResponse {
  id: string;
  message: string;
  pickup: Pickup;
}

export interface UpdatePickupRequest {
  pickupId: string;
  data: Partial<PickupRequest>;
}

export interface CancelPickupRequest {
  pickupId: string;
}

// Pickup hook types
export interface PickupMutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export interface PickupQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}

// Enhanced pickup types for new features
export interface PickupFilters {
  status?: PickupStatus | 'all';
  waste_type?: WasteType | 'all';
  date_range?: 'all' | 'week' | 'month' | 'year';
  search_query?: string;
  urgent_only?: boolean;
  recurring_only?: boolean;
}

export interface PickupStats {
  total_requests: number;
  pending_requests: number;
  scheduled_requests: number;
  completed_requests: number;
  cancelled_requests: number;
  total_weight_collected: number; // in kg
  total_cost_saved: number; // in FCFA
  average_rating: number;
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
  address?: string;
  last_updated: string;
  speed?: number; // km/h
  heading?: number; // degrees
}

export interface PickupTracking {
  pickup_id: string;
  driver_id?: string;
  driver_name?: string;
  driver_phone?: string;
  current_location?: DriverLocation;
  estimated_arrival?: string;
  status_updates: PickupStatusUpdate[];
}

export interface PickupStatusUpdate {
  id: string;
  pickup_id: string;
  status: PickupStatus;
  message: string;
  timestamp: string;
  location?: DriverLocation;
  photos?: string[];
}

export interface PhotoUpload {
  file: File;
  preview_url: string;
  upload_progress?: number;
  uploaded_url?: string;
  error?: string;
}

export interface RecurringPickupSchedule {
  id: string;
  user_id: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  day_of_week?: number; // 0-6, Sunday = 0
  day_of_month?: number; // 1-31
  time_slot: 'morning' | 'afternoon' | 'evening';
  waste_type: WasteType;
  address: string;
  coordinates?: [number, number];
  is_active: boolean;
  next_pickup_date: string;
  created_at: string;
  updated_at: string;
}
