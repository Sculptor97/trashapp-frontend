import { useCallback } from 'react';
import { useAuthMutations } from './useAuthMutations';
import { authService } from '../services/authService';
import { ErrorHandler } from '../lib/utils/errorHandler';

/**
 * Custom hook for Google OAuth authentication
 * Provides simple methods for Google Sign-In button and account management
 */
export const useGoogleAuth = () => {
  const { handleGoogleCallback, unlinkGoogleAccount } = useAuthMutations();

  /**
   * Initiate Google OAuth login flow
   * Redirects user to Google OAuth consent screen
   */
  const loginWithGoogle = useCallback(() => {
    try {
      authService.initiateGoogleAuth();
    } catch (error) {
      ErrorHandler.handleAndShowError(error, 'Failed to start Google authentication');
    }
  }, []);

  /**
   * Link Google account to existing user
   * Redirects user to Google OAuth for account linking
   */
  const linkGoogleAccount = useCallback(() => {
    try {
      authService.linkGoogleAccount();
    } catch (error) {
      ErrorHandler.handleAndShowError(error, 'Failed to start Google account linking');
    }
  }, []);

  /**
   * Unlink Google account from user
   */
  const unlinkGoogle = useCallback(async () => {
    try {
      await unlinkGoogleAccount.mutateAsync();
    } catch {
      // Error is already handled by the mutation
    }
  }, [unlinkGoogleAccount]);

  /**
   * Handle OAuth callback after user returns from Google
   * Should be called on the callback page
   */
  const handleCallback = useCallback(async () => {
    try {
      await handleGoogleCallback.mutateAsync();
    } catch {
      // Error is already handled by the mutation
    }
  }, [handleGoogleCallback]);

  return {
    // Authentication methods
    loginWithGoogle,
    linkGoogleAccount,
    unlinkGoogle,
    handleCallback,
    
    // Loading states
    isLinking: unlinkGoogleAccount.isPending,
    isHandlingCallback: handleGoogleCallback.isPending,
    
    // Error states
    error: unlinkGoogleAccount.error || handleGoogleCallback.error,
  };
};
