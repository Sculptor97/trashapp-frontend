import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { authKeys } from './useAuthQueries';
import type { LoginCredentials, RegisterData } from '../types';

// Auth Mutation Hooks
export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });

  const register = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
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
  };
};
