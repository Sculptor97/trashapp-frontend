import ApiRequest from '../API/axiosClient';
import type {
  PaginationParams,
  Driver,
  PickupWithUser,
  AssignDriverResponse,
  DashboardStats,
  PaginatedPickupsResponse,
  PaginatedUsersResponse,
  PickupStatus,
} from '../types';

// Admin Service Class
export class AdminService {
  /**
   * Get all pickup requests (admin only)
   */
  async getAllPickups(
    params?: PaginationParams
  ): Promise<PaginatedPickupsResponse> {
    try {
      const response = await ApiRequest<PaginatedPickupsResponse>({
        method: 'GET',
        url: '/admin/pickups/', // Placeholder endpoint - to be updated when backend is ready
        config: {
          params,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch all pickups:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch all pickups'
      );
    }
  }

  /**
   * Assign driver to a pickup request
   */
  async assignDriver(
    pickupId: string,
    driverId: string
  ): Promise<AssignDriverResponse> {
    try {
      const response = await ApiRequest<AssignDriverResponse>({
        method: 'POST',
        url: '/admin/pickups/assign/', // Placeholder endpoint
        data: {
          pickup_id: pickupId,
          driver_id: driverId,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to assign driver:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to assign driver'
      );
    }
  }

  /**
   * Get all drivers
   */
  async getAllDrivers(): Promise<Driver[]> {
    try {
      const response = await ApiRequest<Driver[]>({
        method: 'GET',
        url: '/admin/drivers/', // Placeholder endpoint
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch all drivers:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch all drivers'
      );
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await ApiRequest<DashboardStats>({
        method: 'GET',
        url: '/admin/dashboard/stats/', // Placeholder endpoint
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch dashboard stats'
      );
    }
  }

  /**
   * Update pickup status
   */
  async updatePickupStatus(
    pickupId: string,
    status: PickupStatus
  ): Promise<PickupWithUser> {
    try {
      const response = await ApiRequest<PickupWithUser>({
        method: 'PATCH',
        url: `/admin/pickups/${pickupId}/status/`, // Placeholder endpoint
        data: { status },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to update pickup status:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to update pickup status'
      );
    }
  }

  /**
   * Get pickup details with user information
   */
  async getPickupDetails(pickupId: string): Promise<PickupWithUser> {
    try {
      const response = await ApiRequest<PickupWithUser>({
        method: 'GET',
        url: `/admin/pickups/${pickupId}/`, // Placeholder endpoint
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch pickup details:', error);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to fetch pickup details'
      );
    }
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(
    params?: PaginationParams
  ): Promise<PaginatedUsersResponse> {
    try {
      const response = await ApiRequest<PaginatedUsersResponse>({
        method: 'GET',
        url: '/admin/users/', // Placeholder endpoint
        config: {
          params,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to fetch all users'
      );
    }
  }
}

// Export singleton instance
export const adminService = new AdminService();
