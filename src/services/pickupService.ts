import ApiRequest from '../API/axiosClient';
import type {
  PickupRequest,
  Pickup,
  PickupResponse,
} from '../types';

// Pickup Service Class
export class PickupService {
  /**
   * Request a new pickup
   */
  async requestPickup(data: PickupRequest): Promise<PickupResponse> {
    const response = await ApiRequest<PickupResponse>({
      method: 'POST',
      url: '/pickups/request/', // Placeholder endpoint - to be updated when backend is ready
      data,
    });

    return response.data;
  }

  /**
   * Get user's pickup requests
   */
  async getMyPickups(): Promise<Pickup[]> {
    const response = await ApiRequest<Pickup[]>({
      method: 'GET',
      url: '/pickups/my/', // Placeholder endpoint - to be updated when backend is ready
    });

    return response.data;
  }

  /**
   * Get a specific pickup by ID
   */
  async getPickupById(pickupId: string): Promise<Pickup> {
    const response = await ApiRequest<Pickup>({
      method: 'GET',
      url: `/pickups/${pickupId}/`, // Placeholder endpoint
    });

    return response.data;
  }

  /**
   * Cancel a pickup request
   */
  async cancelPickup(pickupId: string): Promise<void> {
    await ApiRequest({
      method: 'PATCH',
      url: `/pickups/${pickupId}/cancel/`, // Placeholder endpoint
    });
  }

  /**
   * Update pickup request
   */
  async updatePickup(pickupId: string, data: Partial<PickupRequest>): Promise<Pickup> {
    const response = await ApiRequest<Pickup>({
      method: 'PATCH',
      url: `/pickups/${pickupId}/`, // Placeholder endpoint
      data,
    });

    return response.data;
  }
}

// Export singleton instance
export const pickupService = new PickupService();
