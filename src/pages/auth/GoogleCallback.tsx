import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2 } from 'lucide-react';

/**
 * Google OAuth Callback Page
 * Handles the OAuth callback after user returns from Google
 */
export const GoogleCallback = () => {
  const { handleCallback, isHandlingCallback, error } = useGoogleAuth();
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;

    const processCallback = async () => {
      try {
        hasProcessed.current = true;
        // Handle OAuth callback - extract code and exchange for tokens
        await handleCallback();
        // Redirect to dashboard or home page after successful authentication
        navigate('/dashboard', { replace: true });
      } catch {
        // Error is already handled by the hook
        // Redirect to login page on error
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  if (isHandlingCallback) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-brand-primary/10">
            <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Completing Authentication
            </h2>
            <p className="text-sm text-gray-600">
              Please wait while we complete your Google authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Authentication Failed
            </h2>
            <p className="text-sm text-gray-600">
              {error instanceof Error
                ? error.message
                : 'An error occurred during authentication'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  return null;
};
