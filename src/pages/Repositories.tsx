import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, GitFork, Eye, ExternalLink, Filter, Menu, Globe, Calendar, Loader2 } from "lucide-react";

interface Repository {
  id: string;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  growth: number;
  category: string;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  owner: {
    login: string;
    avatar_url: string;
    location: string | null;
    country: string;
  };
  topics: string[];
  open_issues_count: number;
  size: number;
}

// Country list with common countries
const countries = [
  { code: 'US', name: 'United States' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
  { code: 'KR', name: 'South Korea' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'IL', name: 'Israel' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MX', name: 'Mexico' },
];

const timeFilters = [
  { value: 'today', label: 'Today', days: 1 },
  { value: 'week', label: 'This Week', days: 7 },
  { value: 'month', label: 'This Month', days: 30 },
  { value: 'all', label: 'All Time', days: null },
];

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const detectCountry = (location: string | null): string => {
  if (!location) return 'Unknown';
  
  const locationLower = location.toLowerCase();
  
  // Country detection based on location strings
  const countryMap: { [key: string]: string } = {
    'united states': 'US', 'usa': 'US', 'america': 'US', 'california': 'US', 'new york': 'US', 'texas': 'US',
    'china': 'CN', 'beijing': 'CN', 'shanghai': 'CN', 'shenzhen': 'CN',
    'india': 'IN', 'bangalore': 'IN', 'mumbai': 'IN', 'delhi': 'IN', 'hyderabad': 'IN',
    'united kingdom': 'GB', 'uk': 'GB', 'london': 'GB', 'england': 'GB',
    'germany': 'DE', 'berlin': 'DE', 'munich': 'DE',
    'france': 'FR', 'paris': 'FR',
    'japan': 'JP', 'tokyo': 'JP', 'osaka': 'JP',
    'canada': 'CA', 'toronto': 'CA', 'montreal': 'CA', 'vancouver': 'CA',
    'australia': 'AU', 'sydney': 'AU', 'melbourne': 'AU',
    'brazil': 'BR', 'são paulo': 'BR', 'rio': 'BR',
    'russia': 'RU', 'moscow': 'RU', 'saint petersburg': 'RU',
    'south korea': 'KR', 'korea': 'KR', 'seoul': 'KR',
    'spain': 'ES', 'madrid': 'ES', 'barcelona': 'ES',
    'italy': 'IT', 'rome': 'IT', 'milan': 'IT',
    'netherlands': 'NL', 'amsterdam': 'NL',
    'sweden': 'SE', 'stockholm': 'SE',
    'switzerland': 'CH', 'zurich': 'CH', 'geneva': 'CH',
    'israel': 'IL', 'tel aviv': 'IL', 'jerusalem': 'IL',
    'singapore': 'SG',
    'mexico': 'MX', 'mexico city': 'MX',
  };
  
  for (const [country, code] of Object.entries(countryMap)) {
    if (locationLower.includes(country)) {
      return code;
    }
  }
  
  return 'Unknown';
};

export default function Repositories() {
  console.log('Repositories component rendering');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [sortBy, setSortBy] = useState('stars');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build GitHub API query
      let searchQuery = 'stars:>100';
      
      // Add country filter if selected
      if (selectedCountry !== 'all') {
        const country = countries.find(c => c.code === selectedCountry);
        if (country) {
          searchQuery += ` location:${country.name}`;
        }
      }

      // Add time filter if not "all"
      if (selectedTime !== 'all') {
        const timeFilter = timeFilters.find(t => t.value === selectedTime);
        if (timeFilter?.days) {
          const cutoffDate = new Date(Date.now() - timeFilter.days * 24 * 60 * 60 * 1000);
          const dateStr = cutoffDate.toISOString().split('T')[0];
          searchQuery += ` created:>${dateStr}`;
        }
      }

      const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=100`;
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };
      
      // Add GitHub token if available
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await fetch(apiUrl, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform and enhance repositories
      const enhancedRepositories = (data.items || []).map((repo: any) => {
        const detectedCountry = detectCountry(repo.owner.location);
        const country = countries.find(c => c.code === detectedCountry);
        
        return {
          id: repo.id.toString(),
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description || '',
          language: repo.language || 'Unknown',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          growth: Math.random() * 25, // Mock growth data
          category: repo.language || 'Other',
          url: repo.html_url,
          html_url: repo.html_url,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
            location: repo.owner.location,
            country: country?.name || 'Unknown'
          },
          topics: repo.topics || [],
          open_issues_count: repo.open_issues_count,
          size: repo.size,
        };
      });

      setRepositories(enhancedRepositories);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories';
      setError(errorMessage);
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
  }, [selectedCountry, selectedTime]);

  const sortOptions = [
    { value: 'stars', label: 'Stars' },
    { value: 'forks', label: 'Forks' },
    { value: 'created', label: 'Created' },
    { value: 'updated', label: 'Updated' },
    { value: 'watchers', label: 'Watchers' },
  ];

  const filteredRepos = repositories.sort((a, b) => {
    switch (sortBy) {
      case 'stars': return b.stars - a.stars;
      case 'forks': return b.forks - a.forks;
      case 'created': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'updated': return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case 'watchers': return b.watchers - a.watchers;
      default: return 0;
    }
  });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getCountryFlag = (countryCode: string) => {
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'CN': '🇨🇳', 'IN': '🇮🇳', 'GB': '🇬🇧', 'DE': '🇩🇪',
      'FR': '🇫🇷', 'JP': '🇯🇵', 'CA': '🇨🇦', 'AU': '🇦🇺', 'BR': '🇧🇷',
      'RU': '🇷🇺', 'KR': '🇰🇷', 'ES': '🇪🇸', 'IT': '🇮🇹', 'NL': '🇳🇱',
      'SE': '🇸🇪', 'CH': '🇨🇭', 'IL': '🇮🇱', 'SG': '🇸🇬', 'MX': '🇲🇽',
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeItem="repositories"
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false);
          }}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-16 z-20 bg-background border-b border-border px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-500" />
                Repository Explorer
              </h1>
              <p className="text-secondary text-sm sm:text-base">Browse repositories by country and time period.</p>
            </div>

            {/* Filters */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="text-blue-800 font-bold mb-4">🔍 FILTERS SECTION (This should be visible!)</div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Country:</span>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code}>
                          <span className="flex items-center gap-2">
                            <span>{getCountryFlag(country.code)}</span>
                            {country.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Time:</span>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {timeFilters.map(filter => (
                        <SelectItem key={filter.value} value={filter.value}>
                          {filter.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2 w-full lg:w-auto">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full lg:w-48 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={fetchRepositories} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 w-full lg:w-auto bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
                  {loading ? 'Loading...' : 'Apply Filters'}
                </Button>
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                Found <span className="font-medium text-gray-900 dark:text-gray-100">{filteredRepos.length}</span> repositories
                {selectedCountry !== 'all' && ` in ${countries.find(c => c.code === selectedCountry)?.name}`}
                {selectedTime !== 'all' && ` from ${timeFilters.find(t => t.value === selectedTime)?.label}`}
              </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-secondary">Loading repositories...</span>
              </div>
            )}

            {/* Repositories Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredRepos.map((repo) => (
                  <Card key={repo.id} className="border-border hover:border-blue transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg mb-2 truncate">{repo.name}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">
                              {repo.language}
                            </Badge>
                            {repo.owner.country !== 'Unknown' && (
                              <Badge variant="outline" className="text-xs border-green text-green bg-green/10">
                                {getCountryFlag(countries.find(c => c.name === repo.owner.country)?.code || '')} {repo.owner.country}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-secondary line-clamp-2">{repo.description}</p>
                      
                      <div className="text-xs text-secondary">
                        Created: {formatTimeAgo(repo.created_at)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-blue mb-1">
                            <Star className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.stars)}</span>
                          </div>
                          <p className="text-xs text-secondary">Stars</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-green mb-1">
                            <GitFork className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.forks)}</span>
                          </div>
                          <p className="text-xs text-secondary">Forks</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-yellow mb-1">
                            <Eye className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.watchers)}</span>
                          </div>
                          <p className="text-xs text-secondary">Watchers</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-xs sm:text-sm text-secondary whitespace-nowrap">Owner:</span>
                          <span className="text-xs sm:text-sm font-medium text-primary truncate">
                            {repo.owner.login}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild className="flex-shrink-0">
                          <a href={repo.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredRepos.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary mb-2">No repositories found</h3>
                <p className="text-secondary">Try adjusting your filters or search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
