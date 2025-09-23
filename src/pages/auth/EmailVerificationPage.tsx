import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { CheckCircle, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');

  const { verifyEmail, resendEmailVerification } = useAuthMutations();

  const handleEmailVerification = useCallback(
    async (verificationToken: string) => {
      try {
        await verifyEmail.mutateAsync(verificationToken);
        setVerificationStatus('success');
      } catch {
        setVerificationStatus('error');
      }
    },
    [verifyEmail]
  );

  useEffect(() => {
    if (token) {
      handleEmailVerification(token);
    }
  }, [token, handleEmailVerification]);

  const handleResendVerification = async () => {
    try {
      await resendEmailVerification.mutateAsync();
    } catch {
      // Error is handled by the mutation
    }
  };

  if (verificationStatus === 'success') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your email has been successfully verified. You can now access all
              features of EcoCollect.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          >
            Go to Dashboard
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/auth/login')}
            className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Sign In Instead
          </Button>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Verification Failed
            </CardTitle>
            <CardDescription className="text-gray-600">
              The verification link is invalid or has expired. Please request a
              new verification email.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleResendVerification}
            disabled={resendEmailVerification.isPending}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          >
            {resendEmailVerification.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Resend Verification Email'
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/auth/login')}
            className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Default state - waiting for verification or no token
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-brand-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-gray-600">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </CardDescription>
        </div>
      </div>

      <div className="bg-brand-light/30 rounded-lg p-4">
        <div className="text-sm text-gray-700 space-y-2">
          <p className="font-medium">Didn't receive the email?</p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Check your spam or junk folder</li>
            <li>Make sure you entered the correct email address</li>
            <li>Wait a few minutes for the email to arrive</li>
          </ul>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleResendVerification}
          disabled={resendEmailVerification.isPending}
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
        >
          {resendEmailVerification.isPending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Resend Verification Email'
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => navigate('/auth/login')}
          className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Need help?{' '}
          <Link
            to="/contact"
            className="font-medium text-brand-primary hover:text-brand-secondary"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
