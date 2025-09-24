import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import { CustomerDashboardLayout } from './layouts/CustomerDashboardLayout';
import { AdminDashboardLayout } from './layouts/AdminDashboardLayout';
import LandingPage from './pages/landing';
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/auth';
import DashboardOverview from './pages/dashboard/Overview';
import DashboardRequests from './pages/dashboard/Requests';
import DashboardSubscription from './pages/dashboard/Subscription';
import DashboardProfile from './pages/dashboard/Profile';
import AdminOverview from './pages/admin/Overview';
import AdminUsers from './pages/admin/Users';
import AdminDrivers from './pages/admin/Drivers';
import AdminRequests from './pages/admin/Requests';
import AdminReports from './pages/admin/Reports';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        {/* <Route path='/demo' element={<ServiceHooksDemo />} /> */}
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-email" element={<EmailVerificationPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Customer Dashboard Routes */}
      <Route path="/dashboard" element={<CustomerDashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="requests" element={<DashboardRequests />} />
        <Route path="subscription" element={<DashboardSubscription />} />
        <Route path="profile" element={<DashboardProfile />} />
      </Route>

      {/* Admin Dashboard Routes */}
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="drivers" element={<AdminDrivers />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </>
  )
);

export default router;
