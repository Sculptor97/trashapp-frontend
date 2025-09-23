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
    try {
      const response = await ApiRequest<PickupResponse>({
        method: 'POST',
        url: '/pickups/request/', // Placeholder endpoint - to be updated when backend is ready
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to request pickup:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to request pickup');
    }
  }

  /**
   * Get user's pickup requests
   */
  async getMyPickups(): Promise<Pickup[]> {
    try {
      const response = await ApiRequest<Pickup[]>({
        method: 'GET',
        url: '/pickups/my/', // Placeholder endpoint - to be updated when backend is ready
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch user pickups:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user pickups');
    }
  }

  /**
   * Get a specific pickup by ID
   */
  async getPickupById(pickupId: string): Promise<Pickup> {
    try {
      const response = await ApiRequest<Pickup>({
        method: 'GET',
        url: `/pickups/${pickupId}/`, // Placeholder endpoint
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch pickup by ID:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch pickup by ID');
    }
  }

  /**
   * Cancel a pickup request
   */
  async cancelPickup(pickupId: string): Promise<void> {
    try {
      await ApiRequest({
        method: 'PATCH',
        url: `/pickups/${pickupId}/cancel/`, // Placeholder endpoint
      });
    } catch (error) {
      console.error('Failed to cancel pickup:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel pickup');
    }
  }

  /**
   * Update pickup request
   */
  async updatePickup(pickupId: string, data: Partial<PickupRequest>): Promise<Pickup> {
    try {
      const response = await ApiRequest<Pickup>({
        method: 'PATCH',
        url: `/pickups/${pickupId}/`, // Placeholder endpoint
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update pickup:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update pickup');
    }
  }
}

// Export singleton instance
export const pickupService = new PickupService();
