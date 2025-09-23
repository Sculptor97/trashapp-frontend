// Pickup Types

export type WasteType = 'general' | 'recyclable' | 'hazardous';
export type PickupStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export interface PickupRequest {
  address: string;
  notes?: string;
  pickup_date?: string;
  waste_type?: WasteType;
}

export interface Pickup {
  id: string;
  user_id: string;
  address: string;
  notes?: string;
  status: PickupStatus;
  waste_type: WasteType;
  pickup_date: string;
  assigned_driver_id?: string;
  driver_name?: string;
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
