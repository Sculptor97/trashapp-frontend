import { useCallback } from 'react';
import { useAuthMutations } from './useAuthMutations';
import { authService } from '../services/authService';
import { ErrorHandler } from '../lib/utils/errorHandler';

/**
 * Custom hook for Google OAuth authentication
 * Provides simple methods for Google Sign-In
 */
export const useGoogleAuth = () => {
  const { handleGoogleCallback } = useAuthMutations();

  /**
   * Initiate Google OAuth login flow
   * Redirects user to Google OAuth consent screen
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      await authService.initiateGoogleAuth();
    } catch (error) {
      ErrorHandler.handleAndShowError(
        error,
        'Failed to start Google authentication'
      );
    }
  }, []);

  /**
   * Handle OAuth callback after user returns from Google
   * Should be called on the callback page
   */
  const handleCallback = useCallback(async () => {
    // Prevent multiple calls if already in progress
    if (handleGoogleCallback.isPending) {
      return;
    }

    try {
      await handleGoogleCallback.mutateAsync();
    } catch {
      // Error is already handled by the mutation
    }
  }, [handleGoogleCallback]);

  return {
    // Authentication methods
    loginWithGoogle,
    handleCallback,

    // Loading states
    isHandlingCallback: handleGoogleCallback.isPending,

    // Error states
    error: handleGoogleCallback.error,
  };
};
