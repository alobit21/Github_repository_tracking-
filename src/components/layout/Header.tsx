import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Calendar, 
  Filter, 
  ChevronDown, 
  Menu, 
  X,
  Home,
  BookOpen,
  MoreHorizontal 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
];

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export function Header({ 
  className, 
  title,
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
    <header className={cn('border-b bg-background w-full', className)}>
      {/* Main header row */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left section - Logo and navigation */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center">
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="bg-transparent">
                <TabsTrigger value="overview" className="data-[state=active]:bg-muted">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="repositories" className="data-[state=active]:bg-muted">
                  Repositories
                  <span className="ml-1 text-xs text-muted-foreground">62</span>
                </TabsTrigger>
                <TabsTrigger value="more" className="data-[state=active]:bg-muted">
                  More
                  <ChevronDown className="ml-1 h-3 w-3" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
        </div>

        {/* Center section - Title */}
        {title && (
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
            <h1 className="text-lg font-semibold text-primary">{title}</h1>
          </div>
        )}

        {/* Right section - Search, filters, and user */}
        <div className="flex items-center gap-2">
          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:block relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-8 h-9"
            />
          </form>

          {/* Desktop filters */}
          <div className="hidden lg:flex items-center gap-1">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[130px] h-9">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-[130px] h-9">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tablet search button */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search className="h-4 w-4" />
          </Button>

          {/* Tablet filter button */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Filter className="h-4 w-4" />
          </Button>

          {/* User dropdown and mobile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu - expands when menu button is clicked */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4">
          {/* Mobile navigation */}
          <nav className="flex flex-col space-y-1">
            <Button variant="ghost" className="justify-start">
              <Home className="h-4 w-4 mr-2" />
              Overview
            </Button>
            <Button variant="ghost" className="justify-start">
              <BookOpen className="h-4 w-4 mr-2" />
              Repositories
              <span className="ml-auto text-xs text-muted-foreground">62</span>
            </Button>
            <Button variant="ghost" className="justify-start">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              More
            </Button>
          </nav>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </form>

          {/* Mobile filters */}
          <div className="space-y-2">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </header>
  );
}