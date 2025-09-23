import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuthMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await resetPassword.mutateAsync(email);
      setEmailSent(true);
    } catch {
      // Error is handled by the mutation
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your
              password.
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
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
          >
            Try Different Email
          </Button>

          <Button
            onClick={() => setEmailSent(false)}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          >
            Resend Reset Link
          </Button>
        </div>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-gray-600">
          No worries! Enter your email address and we'll send you a link to
          reset your password.
        </CardDescription>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          disabled={resetPassword.isPending}
        >
          {resetPassword.isPending
            ? 'Sending Reset Link...'
            : 'Send Reset Link'}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sign In
        </Link>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-brand-primary hover:text-brand-secondary"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
