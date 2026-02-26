import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  TrendingUp,
  Folder,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Signal,
  Tag
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, href: '/' },
  { id: 'trends', label: 'Trends', icon: TrendingUp, href: '/trends' },
  { id: 'categories', label: 'Categories', icon: Tag, href: '/categories' },
  { id: 'repositories', label: 'Repositories', icon: Folder, href: '/repositories' },
  { id: 'alerts', label: 'Alerts', icon: Bell, href: '/alerts' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

interface SidebarProps {
  className?: string;
  activeItem?: string;
  onItemClick?: (item: SidebarItem) => void;
}

export function Sidebar({ className, activeItem = 'dashboard', onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'flex flex-col bg-surface border-r border-border transition-all duration-200 h-full',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
          <Signal className="w-6 h-6 text-blue" />
          {!isCollapsed && (
            <span className="font-semibold text-primary">SignalFromNoise</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-surface transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-secondary" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-secondary" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick?.(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                    'hover:bg-surface',
                    isActive && 'bg-surface border-l-2 border-blue',
                    isCollapsed && 'justify-center px-2'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon 
                    className={cn(
                      'w-5 h-5',
                      isActive ? 'text-blue' : 'text-secondary'
                    )} 
                  />
                  {!isCollapsed && (
                    <span className={cn(
                      'text-sm',
                      isActive ? 'text-primary font-medium' : 'text-secondary'
                    )}>
                      {item.label}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center')}>
          <div className="w-2 h-2 bg-green rounded-full"></div>
          {!isCollapsed && (
            <span className="text-xs text-secondary">Live tracking</span>
          )}
        </div>
      </div>
    </div>
  );
}
