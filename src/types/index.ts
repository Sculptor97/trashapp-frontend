// Export all types from the types directory

// Auth types
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
  RefreshTokenResponse,
  EmailVerificationRequest,
  PasswordResetRequest,
  PasswordResetConfirmRequest,
  ChangePasswordRequest,
  AuthMutationCallbacks,
  AuthQueryOptions,
} from './auth';

// Pickup types
export type {
  WasteType,
  PickupStatus,
  PickupRequest,
  Pickup,
  PickupResponse,
  UpdatePickupRequest,
  CancelPickupRequest,
  PickupMutationCallbacks,
  PickupQueryOptions,
} from './pickup';

// Admin types
export type {
  DriverStatus,
  UserRole,
  SubscriptionStatus,
  Driver,
  User,
  PickupWithUser,
  AssignDriverRequest,
  AssignDriverResponse,
  DashboardStats,
  UpdatePickupStatusRequest,
  PaginatedResponse,
  PaginatedPickupsResponse,
  PaginatedUsersResponse,
  AdminMutationCallbacks,
  AdminQueryOptions,
} from './admin';

// Re-export API types
export type {
  ApiResponse,
  Pagination,
  PaginationParams,
  ErrorResponse,
} from '../API/types/api';
