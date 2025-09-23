import { Outlet, Link } from 'react-router-dom';
import { Recycle, ArrowLeft } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-accent/20">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-primary to-brand-secondary relative overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-center text-white p-12">
            <div className="space-y-8 text-left w-full max-w-md">
              <div className="flex items-center space-x-3">
                <Recycle className="h-12 w-12 text-brand-light" />
                <span className="text-3xl font-bold text-brand-light">
                  EcoCollect
                </span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight">
                  Welcome to EcoCollect
                </h1>
                <p className="text-xl text-brand-light leading-relaxed max-w-md">
                  Join thousands of Cameroonians making a difference in waste
                  management and environmental sustainability.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-brand-light text-sm">Active Users</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">50K+</div>
                  <div className="text-brand-light text-sm">
                    Pickups Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Back to Home Link */}
            <div className="mb-6">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-600 hover:text-brand-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </div>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
              <Recycle className="h-8 w-8 text-brand-primary" />
              <span className="text-2xl font-bold text-brand-primary">
                EcoCollect
              </span>
            </div>

            {/* Auth Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <Outlet />
            </div>

            {/* Footer Links */}
            <div className="mt-8 text-center">
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
        </div>
      </div>
    </div>
  );
}
