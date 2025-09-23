import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { PublicLayout } from './components/layouts/PublicLayout';
import { AuthLayout } from './components/layouts/AuthLayout';
import LandingPage from './pages/landing';
import {
  LoginPage,
  RegisterPage,
  EmailVerificationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/auth';

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
    </>
  )
);

export default router;
