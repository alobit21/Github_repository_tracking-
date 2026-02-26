import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Landing from '@/pages/Landing';
import Trends from '@/pages/Trends';
import Categories from '@/pages/Categories';
import Repositories from '@/pages/Repositories';
import Alerts from '@/pages/Alerts';
import Settings from '@/pages/Settings';
import Trending from '@/pages/dashboard/Trending';
import Activity from '@/pages/dashboard/Activity';
import Stars from '@/pages/dashboard/Stars';
import Users from '@/pages/dashboard/Users';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/dashboard/trending',
    element: <Trending />,
  },
  {
    path: '/dashboard/activity',
    element: <Activity />,
  },
  {
    path: '/dashboard/stars',
    element: <Stars />,
  },
  {
    path: '/dashboard/users',
    element: <Users />,
  },
  {
    path: '/trends',
    element: <Trends />,
  },
  {
    path: '/categories',
    element: <Categories />,
  },
  {
    path: '/repositories',
    element: <Repositories />,
  },
  {
    path: '/alerts',
    element: <Alerts />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
