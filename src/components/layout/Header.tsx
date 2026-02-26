import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search, Calendar, Filter, User, ChevronDown } from 'lucide-react';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
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
    <header className={cn('bg-surface border-b border-border w-full overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 min-w-0">
        {/* Title */}
        <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-semibold text-primary truncate">{title}</h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap min-w-0">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative flex-shrink-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-md text-primary placeholder-secondary focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent w-32 sm:w-48 md:w-64"
            />
          </form>

          {/* Language Filter */}
          <Select.Root value={selectedLanguage} onValueChange={handleLanguageChange}>
            <Select.Trigger className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
              <Filter className="w-4 h-4 text-secondary" />
              <span className="hidden sm:inline">
                <Select.Value />
              </span>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto">
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

          {/* Date Range */}
          <Select.Root value={selectedDateRange} onValueChange={handleDateRangeChange}>
            <Select.Trigger className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-background border border-border rounded-md text-primary hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue text-sm">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="hidden sm:inline">
                <Select.Value />
              </span>
              <ChevronDown className="w-4 h-4 text-secondary" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-auto">
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

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex items-center gap-2 p-2 rounded-md hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-blue">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue rounded-full flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <ChevronDown className="w-4 h-4 text-secondary hidden sm:block" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-surface border border-border rounded-md shadow-lg p-2 min-w-48">
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
    </header>
  );
}
