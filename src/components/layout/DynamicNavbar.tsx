import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

interface DynamicNavbarProps {
  onSearch?: (query: string) => void;
  onLanguageFilter?: (language: string) => void;
  onDateRangeChange?: (range: string) => void;
}

export function DynamicNavbar({ 
  onSearch,
  onLanguageFilter,
  onDateRangeChange
}: DynamicNavbarProps) {
  const location = useLocation();
  
  // Check if current route is a dashboard route or should use dashboard navbar
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                          location.pathname === '/repositories' ||
                          location.pathname === '/trends' ||
                          location.pathname === '/categories' ||
                          location.pathname === '/global-discovery' ||
                          location.pathname === '/new-repository-radar' ||
                          location.pathname === '/alerts' ||
                          location.pathname === '/settings';
  
  const isLandingRoute = location.pathname === '/';
  
  // Landing page navbar - simple and minimal
  if (isLandingRoute) {
    return <Navbar />;
  }
  
  // Dashboard navbar - full featured with sidebar and header
  if (isDashboardRoute) {
    return (
      <>
        {/* Top Sidebar Navigation */}
        <div className="sticky top-0 z-50">
          <Sidebar 
            activeItem={getActiveDashboardItem(location.pathname)}
            onItemClick={(item) => {
              // Navigation is handled by the Sidebar component
              console.log('Navigate to:', item.id);
            }}
            isMobile={false}
          />
        </div>
        
        {/* Header with search and filters */}
        <div className="sticky top-16 z-40 bg-background border-b border-border">
          <Header
            onSearch={onSearch}
            onLanguageFilter={onLanguageFilter}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </>
    );
  }
  
  // Fallback to landing navbar for any other routes
  return <Navbar />;
}

// Helper function to determine active dashboard item based on route
function getActiveDashboardItem(pathname: string): string {
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'dashboard';
  if (pathname === '/repositories') return 'repositories';
  if (pathname === '/trends') return 'trends';
  if (pathname === '/categories') return 'categories';
  if (pathname === '/global-discovery') return 'global-discovery';
  if (pathname === '/new-repository-radar') return 'new-repository-radar';
  if (pathname === '/alerts') return 'alerts';
  if (pathname === '/settings') return 'settings';
  if (pathname === '/dashboard/analytics') return 'analytics';
  if (pathname === '/dashboard/trending') return 'trending';
  if (pathname === '/dashboard/activity') return 'activity';
  if (pathname === '/dashboard/stars') return 'stars';
  if (pathname === '/dashboard/users') return 'users';
  if (pathname === '/dashboard/insights') return 'insights';
  return 'dashboard'; // default
}
