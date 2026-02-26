import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  Settings, 
  Users, 
  Star,
  GitBranch,
  Activity,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}

interface SidebarProps {
  className?: string;
  activeItem?: string;
  onItemClick?: (item: SidebarItem) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: BarChart3,
    href: '/dashboard',
  },
  {
    id: 'trending',
    label: 'Trending',
    icon: TrendingUp,
    href: '/dashboard/trending',
  },
  {
    id: 'repositories',
    label: 'Repositories',
    icon: GitBranch,
    href: '/repositories',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    href: '/dashboard/activity',
  },
  {
    id: 'stars',
    label: 'Starred',
    icon: Star,
    href: '/dashboard/stars',
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export function Sidebar({ 
  className, 
  activeItem = 'dashboard',
  onItemClick,
  isMobile = false,
  onClose
}: SidebarProps) {
  const handleItemClick = (item: SidebarItem) => {
    onItemClick?.(item);
    if (item.href) {
      window.location.href = item.href;
    }
  };

  return (
    <div className={cn(
      "w-64 bg-surface border-r border-border h-full flex flex-col",
      className
    )}>
      {/* Header with Close Button for Mobile */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-primary">GitTrack</h1>
            <p className="text-xs text-secondary">Repository Analytics</p>
          </div>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-blue text-white"
                      : "text-secondary hover:bg-card hover:text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-secondary text-center">
          <p>GitTrack v1.0.0</p>
          <p className="mt-1">© 2026 GitTrack</p>
        </div>
      </div>
    </div>
  );
}