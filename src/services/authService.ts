import ApiRequest from '../API/axiosClient';
import { endpoints } from '../API/endpoints';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UserProfile,
} from '../types';

// Token management class
export class TokenManager {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Auth Service Class
export class AuthService {
  private tokenManager = TokenManager;

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiRequest<AuthResponse>({
        method: 'POST',
        url: endpoints.auth.basic.login,
        data: credentials,
      });

      // Save tokens to localStorage
      if (response.data.access_token) {
        this.tokenManager.setToken(response.data.access_token);
      }
      if (response.data.refresh_token) {
        this.tokenManager.setRefreshToken(response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await ApiRequest<AuthResponse>({
        method: 'POST',
        url: endpoints.auth.basic.register,
        data,
      });

      // Save tokens to localStorage
      if (response.data.access_token) {
        this.tokenManager.setToken(response.data.access_token);
      }
      if (response.data.refresh_token) {
        this.tokenManager.setRefreshToken(response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await ApiRequest({
        method: 'POST',
        url: endpoints.auth.basic.logout,
      });
    } catch (error) {
      // Even if the API call fails, we should clear local tokens
      console.warn('Logout API call failed, but clearing local tokens:', error);
    } finally {
      // Always clear tokens from localStorage
      this.tokenManager.clearTokens();
    }
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await ApiRequest<UserProfile>({
        method: 'GET',
        url: endpoints.auth.profile,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch profile');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ access_token: string }> {
    const refreshToken = this.tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await ApiRequest<{ access_token: string }>({
      method: 'POST',
      url: endpoints.auth.token.refresh,
      data: { refresh_token: refreshToken },
    });

    // Update access token
    if (response.data.access_token) {
      this.tokenManager.setToken(response.data.access_token);
    }

    return response.data;
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    await ApiRequest({
      method: 'POST',
      url: endpoints.auth.email.verify,
      data: { token },
    });
  }

  /**
   * Resend email verification
   */
  async resendEmailVerification(): Promise<void> {
    await ApiRequest({
      method: 'POST',
      url: endpoints.auth.email.resend,
    });
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    await ApiRequest({
      method: 'POST',
      url: endpoints.auth.password.reset,
      data: { email },
    });
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    await ApiRequest({
      method: 'POST',
      url: endpoints.auth.password.confirm,
      data: { token, password: newPassword },
    });
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await ApiRequest({
      method: 'POST',
      url: endpoints.auth.password.change,
      data: { current_password: currentPassword, new_password: newPassword },
    });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenManager.isAuthenticated();
  }

  // Google OAuth Methods (for Passport.js backend)

  /**
   * Initiate Google OAuth flow
   * Redirects user to Google OAuth consent screen
   */
  initiateGoogleAuth(): void {
    // Redirect to backend Google OAuth endpoint
    window.location.href = endpoints.auth.google.init;
  }

  /**
   * Handle Google OAuth callback
   * This method should be called after the user returns from Google OAuth
   * The backend will handle the OAuth flow and redirect back with tokens
   */
  async handleGoogleCallback(): Promise<AuthResponse> {
    try {
      const response = await ApiRequest<AuthResponse>({
        method: 'GET',
        url: endpoints.auth.google.callback,
      });

      // Save tokens to localStorage if they exist
      if (response.data.access_token) {
        this.tokenManager.setToken(response.data.access_token);
      }
      if (response.data.refresh_token) {
        this.tokenManager.setRefreshToken(response.data.refresh_token);
      }

      return response.data;
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Google OAuth callback failed');
    }
  }

  /**
   * Link Google account to existing user
   * This method initiates the Google OAuth flow for account linking
   */
  linkGoogleAccount(): void {
    // Redirect to backend Google OAuth endpoint with linking parameter
    const linkUrl = `${endpoints.auth.google.init}?link=true`;
    window.location.href = linkUrl;
  }

  /**
   * Unlink Google account from user
   */
  async unlinkGoogleAccount(): Promise<void> {
    try {
      await ApiRequest({
        method: 'DELETE',
        url: endpoints.auth.google.exchange,
      });
    } catch (error) {
      console.error('Failed to unlink Google account:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to unlink Google account');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
