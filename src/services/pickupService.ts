import { endpoints } from '@/API/endpoints';
import ApiRequest from '../API/axiosClient';
import type {
  PickupRequest,
  Pickup,
  PickupResponse,
  PickupFilters,
  PickupStats,
  PickupTracking,
  RecurringPickupSchedule,
} from '../types/pickup';

// Pickup Service Class
export class PickupService {
  /**
   * Request a new pickup
   */
  async requestPickup(data: PickupRequest): Promise<PickupResponse> {
    try {
      const response = await ApiRequest<PickupResponse>({
        method: 'POST',
        url: endpoints.customer.pickups.request,
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to request pickup:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to request pickup'
      );
    }
  }

  /**
   * Get user's pickup requests with optional filtering
   */
  async getMyPickups(filters?: PickupFilters): Promise<Pickup[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      if (filters?.waste_type && filters.waste_type !== 'all') {
        params.append('waste_type', filters.waste_type);
      }
      if (filters?.date_range && filters.date_range !== 'all') {
        params.append('date_range', filters.date_range);
      }
      if (filters?.search_query) {
        params.append('search', filters.search_query);
      }
      if (filters?.urgent_only) {
        params.append('urgent_only', 'true');
      }
      if (filters?.recurring_only) {
        params.append('recurring_only', 'true');
      }

      const queryString = params.toString();
      const url = queryString
        ? endpoints.customer.pickups.myWithFilters(queryString)
        : endpoints.customer.pickups.my;

      const response = await ApiRequest<Pickup[]>({
        method: 'GET',
        url,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch user pickups:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch user pickups'
      );
    }
  }

  /**
   * Get a specific pickup by ID
   */
  async getPickupById(pickupId: string): Promise<Pickup> {
    try {
      const response = await ApiRequest<Pickup>({
        method: 'GET',
        url: endpoints.customer.pickups.detail(pickupId),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch pickup by ID:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch pickup by ID'
      );
    }
  }

  /**
   * Cancel a pickup request
   */
  async cancelPickup(pickupId: string): Promise<void> {
    try {
      await ApiRequest({
        method: 'PATCH',
        url: endpoints.customer.pickups.cancel(pickupId),
      });
    } catch (error) {
      console.error('Failed to cancel pickup:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to cancel pickup'
      );
    }
  }

  /**
   * Update pickup request
   */
  async updatePickup(
    pickupId: string,
    data: Partial<PickupRequest>
  ): Promise<Pickup> {
    try {
      const response = await ApiRequest<Pickup>({
        method: 'PATCH',
        url: endpoints.customer.pickups.detail(pickupId),
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update pickup:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to update pickup'
      );
    }
  }

  /**
   * Upload photos for a pickup request
   */
  async uploadPickupPhotos(
    pickupId: string,
    photos: File[]
  ): Promise<string[]> {
    try {
      const formData = new FormData();
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await ApiRequest<{ photo_urls: string[] }>({
        method: 'POST',
        url: endpoints.customer.pickups.photos(pickupId),
        data: formData,
        config: {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      });

      return response.data.photo_urls;
    } catch (error) {
      console.error('Failed to upload photos:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to upload photos'
      );
    }
  }

  /**
   * Get pickup statistics for the user
   */
  async getPickupStats(): Promise<PickupStats> {
    try {
      const response = await ApiRequest<PickupStats>({
        method: 'GET',
        url: endpoints.customer.pickups.stats,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch pickup stats:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch pickup stats'
      );
    }
  }

  /**
   * Get real-time tracking for a pickup
   */
  async getPickupTracking(pickupId: string): Promise<PickupTracking> {
    try {
      const response = await ApiRequest<PickupTracking>({
        method: 'GET',
        url: endpoints.customer.pickups.tracking(pickupId),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch pickup tracking:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch pickup tracking'
      );
    }
  }

  /**
   * Rate a completed pickup
   */
  async ratePickup(
    pickupId: string,
    rating: number,
    feedback?: string
  ): Promise<void> {
    try {
      await ApiRequest({
        method: 'POST',
        url: endpoints.customer.pickups.rate(pickupId),
        data: { rating, feedback },
      });
    } catch (error) {
      console.error('Failed to rate pickup:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to rate pickup'
      );
    }
  }

  /**
   * Create recurring pickup schedule
   */
  async createRecurringSchedule(
    data: Omit<
      RecurringPickupSchedule,
      'id' | 'user_id' | 'created_at' | 'updated_at'
    >
  ): Promise<RecurringPickupSchedule> {
    try {
      const response = await ApiRequest<RecurringPickupSchedule>({
        method: 'POST',
        url: endpoints.customer.pickups.recurring.create,
        data,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create recurring schedule:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to create recurring schedule'
      );
    }
  }

  /**
   * Get user's recurring pickup schedules
   */
  async getRecurringSchedules(): Promise<RecurringPickupSchedule[]> {
    try {
      const response = await ApiRequest<RecurringPickupSchedule[]>({
        method: 'GET',
        url: endpoints.customer.pickups.recurring.all,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch recurring schedules:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch recurring schedules'
      );
    }
  }

  /**
   * Contact driver for an active pickup
   */
  async contactDriver(pickupId: string, message: string): Promise<void> {
    try {
      await ApiRequest({
        method: 'POST',
        url: endpoints.customer.pickups.contactDriver(pickupId),
        data: { message },
      });
    } catch (error) {
      console.error('Failed to contact driver:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to contact driver'
      );
    }
  }

  /**
   * Calculate estimated cost for a pickup
   */
  calculateEstimatedCost(
    wasteType: string,
    weight: number,
    urgent: boolean = false
  ): number {
    const baseCosts = {
      general: 1000, // FCFA per kg
      recyclable: 800,
      hazardous: 2000,
    };

    const baseCost =
      baseCosts[wasteType as keyof typeof baseCosts] || baseCosts.general;
    let cost = baseCost * weight;

    if (urgent) {
      cost *= 1.5; // 50% surcharge for urgent pickup
    }

    return Math.round(cost);
  }
}

// Export singleton instance
export const pickupService = new PickupService();
