import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authKeys } from '../API/queryKeys';
import { ErrorHandler } from '../lib/utils/errorHandler';
import type { LoginCredentials, RegisterData } from '../types';

// Auth Mutation Hooks
export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      ErrorHandler.showSuccessToast('Login successful!');
    },
    onError: (error) => {
      ErrorHandler.handleAndShowError(error, 'Login failed');
    },
  });

  const register = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      ErrorHandler.showSuccessToast('Registration successful!');
    },
    onError: (error) => {
      ErrorHandler.handleAndShowError(error, 'Registration failed');
    },
  });

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      ErrorHandler.showSuccessToast('Logged out successfully!');
    },
    onError: (error) => {
      ErrorHandler.handleAndShowError(error, 'Logout failed');
    },
  });

  const refreshToken = useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });

  const verifyEmail = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });

  const resendEmailVerification = useMutation({
    mutationFn: () => authService.resendEmailVerification(),
  });

  const resetPassword = useMutation({
    mutationFn: (email: string) => authService.resetPassword(email),
  });

  const confirmPasswordReset = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.confirmPasswordReset(token, newPassword),
  });

  const changePassword = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
  });

  // Google OAuth Mutations
  const handleGoogleCallback = useMutation({
    mutationFn: () => authService.handleGoogleCallback(),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      ErrorHandler.showSuccessToast('Google authentication successful!');
    },
    onError: (error) => {
      ErrorHandler.handleAndShowError(error, 'Google authentication failed');
    },
  });

  const unlinkGoogleAccount = useMutation({
    mutationFn: () => authService.unlinkGoogleAccount(),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      ErrorHandler.showSuccessToast('Google account unlinked successfully!');
    },
    onError: (error) => {
      ErrorHandler.handleAndShowError(error, 'Failed to unlink Google account');
    },
  });

  return {
    login,
    register,
    logout,
    refreshToken,
    verifyEmail,
    resendEmailVerification,
    resetPassword,
    confirmPasswordReset,
    changePassword,
    // Google OAuth mutations
    handleGoogleCallback,
    unlinkGoogleAccount,
  };
};
