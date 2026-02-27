import { createBrowserRouter, RouterProvider, Outlet, useLocation } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Landing from '@/pages/Landing';
import Trends from '@/pages/Trends';
import Categories from '@/pages/Categories';
// import Repositories from '@/pages/Repositories';
import Alerts from '@/pages/Alerts';
import Settings from '@/pages/Settings';
import Trending from '@/pages/dashboard/Trending';
import Activity from '@/pages/dashboard/Activity';
import Stars from '@/pages/dashboard/Stars';
import Users from '@/pages/dashboard/Users';
import NewRepositoryRadar from './pages/NewRepositoryRadar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Dashboard Layout Component
function DashboardLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  // Determine active sidebar item based on current path
  const getActiveItem = (pathname: string): string => {
    if (pathname === '/') return 'home';
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/trending')) return 'trending';
    if (pathname.startsWith('/dashboard/repositories')) return 'repositories';
    if (pathname.startsWith('/dashboard/activity')) return 'activity';
    if (pathname.startsWith('/dashboard/stars')) return 'stars';
    if (pathname.startsWith('/dashboard/users')) return 'users';
    if (pathname.startsWith('/dashboard/trends')) return 'trends';
    if (pathname.startsWith('/dashboard/categories')) return 'categories';
    if (pathname.startsWith('/dashboard/alerts')) return 'alerts';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'dashboard'; // default
  };

  const activeItem = getActiveItem(location.pathname);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-surface border-border"
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`fixed inset-0 z-40 lg:relative lg:inset-auto transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar 
          activeItem={activeItem}
          isMobile={true}
          onClose={() => setIsSidebarOpen(false)}
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      {/* Desktop Sidebar (always visible) */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem={activeItem}
          isMobile={false}
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content - With left padding for sidebar */}
      <div className="flex-1 flex flex-col lg:ml-64 ml-0">
        {/* Header - Sticky */}
        <div className="sticky top-0 z-20 bg-background border-b border-border">
          <Header
            onSearch={setSearchQuery}
            onLanguageFilter={setSelectedLanguage}
          />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet context={{ searchQuery, selectedLanguage, setSearchQuery, setSelectedLanguage }} />
        </main>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'repositories',
        element: <NewRepositoryRadar />,
      },
      {
        path: 'trending',
        element: <Trending />,
      },
      {
        path: 'activity',
        element: <Activity />,
      },
      {
        path: 'stars',
        element: <Stars />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'trends',
        element: <Trends />,
      },
      {
        path: 'categories',
        element: <Categories />,
      },
      {
        path: 'alerts',
        element: <Alerts />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
