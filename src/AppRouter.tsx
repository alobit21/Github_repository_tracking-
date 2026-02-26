import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Landing from '@/pages/Landing';

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/',
    element: <Landing />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
