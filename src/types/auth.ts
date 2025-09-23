// Authentication Types

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

export interface EmailVerificationRequest {
  token: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// Google Auth Types (for Passport.js backend)
export interface GoogleAuthResponse {
  success: boolean;
  message?: string;
  redirect_url?: string;
}

// Auth hook types
export interface AuthMutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export interface AuthQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  refetchInterval?: number;
}
