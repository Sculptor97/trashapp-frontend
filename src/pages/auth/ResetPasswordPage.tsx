import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetStatus, setResetStatus] = useState<'pending' | 'success' | 'error'>('pending');
  
  const { confirmPasswordReset } = useAuthMutations();

  useEffect(() => {
    if (!token) {
      setResetStatus('error');
    }
  }, [token]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      // Handle password mismatch error
      return;
    }

    if (!token) {
      setResetStatus('error');
      return;
    }
    
    try {
      await confirmPasswordReset.mutateAsync({
        token,
        newPassword: formData.password,
      });
      setResetStatus('success');
    } catch {
      setResetStatus('error');
    }
  };

  if (resetStatus === 'success') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Password Reset Successful!</CardTitle>
            <CardDescription className="text-gray-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          >
            Sign In Now
          </Button>
        </div>
      </div>
    );
  }

  if (resetStatus === 'error') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Invalid Reset Link</CardTitle>
            <CardDescription className="text-gray-600">
              This password reset link is invalid or has expired. Please request a new password reset.
            </CardDescription>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => navigate('/auth/forgot-password')}
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          >
            Request New Reset Link
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-900">Reset Your Password</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your new password below. Make sure it's secure and easy for you to remember.
        </CardDescription>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="pl-10 pr-10 border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <div className="text-sm text-red-600">
            Passwords do not match
          </div>
        )}

        <div className="bg-brand-light/30 rounded-lg p-4">
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-2">Password requirements:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-semibold py-2.5"
          disabled={confirmPasswordReset.isPending || formData.password !== formData.confirmPassword}
        >
          {confirmPasswordReset.isPending ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>

      <div className="text-center">
        <Link
          to="/auth/login"
          className="text-sm font-medium text-brand-primary hover:text-brand-secondary"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
