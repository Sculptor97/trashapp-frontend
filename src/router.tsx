import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import LandingPage from './pages/landing';
import ServiceHooksDemo from './examples/ServiceHooksDemo';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path='/demo' element={<ServiceHooksDemo />} />
    </>
  )
);

export default router;
