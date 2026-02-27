import { Outlet } from 'react-router-dom';
import { DynamicNavbar } from '@/components/layout/DynamicNavbar';

interface LayoutProps {
  onSearch?: (query: string) => void;
  onLanguageFilter?: (language: string) => void;
  onDateRangeChange?: (range: string) => void;
}

export function Layout({ 
  onSearch,
  onLanguageFilter,
  onDateRangeChange
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <DynamicNavbar
        onSearch={onSearch}
        onLanguageFilter={onLanguageFilter}
        onDateRangeChange={onDateRangeChange}
      />
      <Outlet />
    </div>
  );
}
