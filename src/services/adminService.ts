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
  async getAllPickups(params?: PaginationParams): Promise<PaginatedPickupsResponse> {
    const response = await ApiRequest<PaginatedPickupsResponse>({
      method: 'GET',
      url: '/admin/pickups/', // Placeholder endpoint - to be updated when backend is ready
      config: {
        params,
      },
    });

    return response.data;
  }

  /**
   * Assign driver to a pickup request
   */
  async assignDriver(pickupId: string, driverId: string): Promise<AssignDriverResponse> {
    const response = await ApiRequest<AssignDriverResponse>({
      method: 'POST',
      url: '/admin/pickups/assign/', // Placeholder endpoint
      data: {
        pickup_id: pickupId,
        driver_id: driverId,
      },
    });

    return response.data;
  }

  /**
   * Get all drivers
   */
  async getAllDrivers(): Promise<Driver[]> {
    const response = await ApiRequest<Driver[]>({
      method: 'GET',
      url: '/admin/drivers/', // Placeholder endpoint
    });

    return response.data;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await ApiRequest<DashboardStats>({
      method: 'GET',
      url: '/admin/dashboard/stats/', // Placeholder endpoint
    });

    return response.data;
  }

  /**
   * Update pickup status
   */
  async updatePickupStatus(
    pickupId: string,
    status: PickupStatus
  ): Promise<PickupWithUser> {
    const response = await ApiRequest<PickupWithUser>({
      method: 'PATCH',
      url: `/admin/pickups/${pickupId}/status/`, // Placeholder endpoint
      data: { status },
    });

    return response.data;
  }

  /**
   * Get pickup details with user information
   */
  async getPickupDetails(pickupId: string): Promise<PickupWithUser> {
    const response = await ApiRequest<PickupWithUser>({
      method: 'GET',
      url: `/admin/pickups/${pickupId}/`, // Placeholder endpoint
    });

    return response.data;
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params?: PaginationParams): Promise<PaginatedUsersResponse> {
    const response = await ApiRequest<PaginatedUsersResponse>({
      method: 'GET',
      url: '/admin/users/', // Placeholder endpoint
      config: {
        params,
      },
    });

    return response.data;
  }
}

// Export singleton instance
export const adminService = new AdminService();
