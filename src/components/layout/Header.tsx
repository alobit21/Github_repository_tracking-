import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Calendar, Filter, User, ChevronDown, Menu, X } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';

interface HeaderProps {
  className?: string;
  title?: string;
  onSearch?: (query: string) => void;
  onLanguageFilter?: (language: string) => void;
  onDateRangeChange?: (range: string) => void;
}

const languages = [
  { value: 'all', label: 'All Languages' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'rust', label: 'Rust' },
  { value: 'go', label: 'Go' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
];

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

export function Header({ 
  className, 
  title = 'Dashboard',
  onSearch,
  onLanguageFilter,
  onDateRangeChange 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    onLanguageFilter?.(value);
  };

  const handleDateRangeChange = (value: string) => {
    setSelectedDateRange(value);
    onDateRangeChange?.(value);
  };

  return (
    <header className={cn('bg-surface border-b border-border w-full', className)}>
      {/* Top row - always visible */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left section - User info */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-primary truncate hidden xs:inline">alobit21</span>
          </div>
          
          {/* Navigation tabs - hidden on mobile, visible on tablet+ */}
          <nav className="hidden sm:flex items-center gap-1 ml-4">
            <button className="px-3 py-1 text-sm text-primary hover:bg-surface rounded-md">Overview</button>
            <button className="px-3 py-1 text-sm font-medium text-primary bg-surface/50 rounded-md">Repositories</button>
            <span className="px-2 py-1 text-sm text-secondary">62</span>
            <button className="px-3 py-1 text-sm text-primary hover:bg-surface rounded-md flex items-center gap-1">
              More <ChevronDown className="w-3 h-3" />
            </button>
          </nav>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop search - hidden on mobile */}
          <form onSubmit={handleSearch} className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 bg-background border border-border rounded-md text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent w-48 lg:w-64 text-sm"
            />
          </form>

          {/* Desktop filters - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <Select.Root value={selectedLanguage} onValueChange={handleLanguageChange}>
              <Select.Trigger className="flex items-center gap-1 px-2 py-1.5 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
                <Filter className="w-4 h-4 text-secondary" />
                <span className="hidden lg:inline max-w-24 truncate">
                  <Select.Value />
                </span>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {languages.map((language) => (
                    <Select.Item
                      key={language.value}
                      value={language.value}
                      className="px-3 py-2 text-primary hover:bg-surface cursor-pointer focus:bg-surface focus:outline-none"
                    >
                      <Select.ItemText>{language.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <Select.Root value={selectedDateRange} onValueChange={handleDateRangeChange}>
              <Select.Trigger className="flex items-center gap-1 px-2 py-1.5 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
                <Calendar className="w-4 h-4 text-secondary" />
                <span className="hidden lg:inline">
                  <Select.Value />
                </span>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {dateRanges.map((range) => (
                    <Select.Item
                      key={range.value}
                      value={range.value}
                      className="px-3 py-2 text-primary hover:bg-surface cursor-pointer focus:bg-surface focus:outline-none"
                    >
                      <Select.ItemText>{range.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-surface transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </button>

          {/* User menu - always visible */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="hidden sm:flex items-center gap-2 p-1.5 rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue">
              <div className="w-7 h-7 bg-blue rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-secondary hidden lg:block" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border rounded-md shadow-lg p-2 min-w-48 z-50">
                <DropdownMenu.Item className="px-3 py-2 text-primary hover:bg-surface rounded cursor-pointer focus:bg-surface focus:outline-none">
                  Profile
                </DropdownMenu.Item>
                <DropdownMenu.Item className="px-3 py-2 text-primary hover:bg-surface rounded cursor-pointer focus:bg-surface focus:outline-none">
                  Settings
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-border my-2" />
                <DropdownMenu.Item className="px-3 py-2 text-primary hover:bg-surface rounded cursor-pointer focus:bg-surface focus:outline-none">
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Mobile navigation - visible when menu is open */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-4">
          {/* Mobile navigation tabs */}
          <nav className="flex flex-wrap items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-primary hover:bg-surface rounded-md">Overview</button>
            <button className="px-3 py-1.5 text-sm font-medium text-primary bg-surface/50 rounded-md">Repositories</button>
            <span className="px-3 py-1.5 text-sm text-secondary bg-surface/30 rounded-md">62</span>
            <button className="px-3 py-1.5 text-sm text-primary hover:bg-surface rounded-md flex items-center gap-1">
              More <ChevronDown className="w-3 h-3" />
            </button>
          </nav>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent text-sm"
            />
          </form>

          {/* Mobile filters */}
          <div className="flex flex-col gap-2">
            <Select.Root value={selectedLanguage} onValueChange={handleLanguageChange}>
              <Select.Trigger className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary" />
                  <span>Language: <Select.Value /></span>
                </div>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {languages.map((language) => (
                    <Select.Item
                      key={language.value}
                      value={language.value}
                      className="px-3 py-2 text-primary hover:bg-surface cursor-pointer focus:bg-surface focus:outline-none"
                    >
                      <Select.ItemText>{language.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <Select.Root value={selectedDateRange} onValueChange={handleDateRangeChange}>
              <Select.Trigger className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-secondary" />
                  <span>Date: <Select.Value /></span>
                </div>
                <ChevronDown className="w-4 h-4 text-secondary" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {dateRanges.map((range) => (
                    <Select.Item
                      key={range.value}
                      value={range.value}
                      className="px-3 py-2 text-primary hover:bg-surface cursor-pointer focus:bg-surface focus:outline-none"
                    >
                      <Select.ItemText>{range.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        </div>
      )}
    </header>
  );
}