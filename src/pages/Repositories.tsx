import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Star, GitFork, Eye, ExternalLink, Filter, Menu, Globe, Calendar, Loader2, Search, X } from "lucide-react";

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
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'GH', name: 'Ghana' },
  { code: 'UG', name: 'Uganda' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'MA', name: 'Morocco' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'TR', name: 'Turkey' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IR', name: 'Iran' },
  { code: 'PL', name: 'Poland' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' },
  { code: 'AT', name: 'Austria' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'NZ', name: 'New Zealand' },
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
    // African countries
    'south africa': 'ZA', 'johannesburg': 'ZA', 'cape town': 'ZA', 'pretoria': 'ZA',
    'nigeria': 'NG', 'lagos': 'NG', 'abuja': 'NG', 'kano': 'NG',
    'egypt': 'EG', 'cairo': 'EG', 'alexandria': 'EG', 'giza': 'EG',
    'kenya': 'KE', 'nairobi': 'KE', 'mombasa': 'KE', 'kisumu': 'KE',
    'tanzania': 'TZ', 'dar es salaam': 'TZ', 'dodoma': 'TZ', 'arusha': 'TZ', 'mwanza': 'TZ', 'zanzibar': 'TZ',
    'ghana': 'GH', 'accra': 'GH', 'kumasi': 'GH', 'tamale': 'GH',
    'uganda': 'UG', 'kampala': 'UG', 'gulu': 'UG', 'jinja': 'UG',
    'algeria': 'DZ', 'algiers': 'DZ', 'oran': 'DZ', 'constantine': 'DZ',
    'morocco': 'MA', 'casablanca': 'MA', 'rabat': 'MA', 'marrakech': 'MA', 'fez': 'MA',
    // Asian countries
    'thailand': 'TH', 'bangkok': 'TH', 'chiang mai': 'TH', 'phuket': 'TH',
    'vietnam': 'VN', 'hanoi': 'VN', 'ho chi minh': 'VN', 'da nang': 'VN',
    'philippines': 'PH', 'manila': 'PH', 'cebu': 'PH', 'davao': 'PH',
    'malaysia': 'MY', 'kuala lumpur': 'MY', 'penang': 'MY', 'johor bahru': 'MY',
    'indonesia': 'ID', 'jakarta': 'ID', 'bali': 'ID', 'surabaya': 'ID', 'bandung': 'ID',
    'pakistan': 'PK', 'karachi': 'PK', 'islamabad': 'PK', 'lahore': 'PK',
    'bangladesh': 'BD', 'dhaka': 'BD', 'chittagong': 'BD', 'khulna': 'BD',
    'turkey': 'TR', 'istanbul': 'TR', 'ankara': 'TR', 'izmir': 'TR',
    'saudi arabia': 'SA', 'riyadh': 'SA', 'jeddah': 'SA', 'mecca': 'SA', 'medina': 'SA',
    'united arab emirates': 'AE', 'dubai': 'AE', 'abu dhabi': 'AE', 'sharjah': 'AE',
    'iran': 'IR', 'tehran': 'IR', 'mashhad': 'IR', 'isfahan': 'IR',
    // European countries
    'poland': 'PL', 'warsaw': 'PL', 'krakow': 'PL', 'gdansk': 'PL',
    'norway': 'NO', 'oslo': 'NO', 'bergen': 'NO', 'trondheim': 'NO',
    'denmark': 'DK', 'copenhagen': 'DK', 'aarhus': 'DK', 'odense': 'DK',
    'finland': 'FI', 'helsinki': 'FI', 'espoo': 'FI', 'tampere': 'FI',
    'greece': 'GR', 'athens': 'GR', 'thessaloniki': 'GR', 'patras': 'GR',
    'portugal': 'PT', 'lisbon': 'PT', 'porto': 'PT', 'coimbra': 'PT',
    'ireland': 'IE', 'dublin': 'IE', 'cork': 'IE', 'galway': 'IE',
    'austria': 'AT', 'vienna': 'AT', 'salzburg': 'AT', 'innsbruck': 'AT',
    'czech republic': 'CZ', 'prague': 'CZ', 'brno': 'CZ', 'ostrava': 'CZ',
    'hungary': 'HU', 'budapest': 'HU', 'debrecen': 'HU', 'szeged': 'HU',
    'romania': 'RO', 'bucharest': 'RO', 'cluj-napoca': 'RO', 'timisoara': 'RO',
    'ukraine': 'UA', 'kyiv': 'UA', 'kharkiv': 'UA', 'odesa': 'UA',
    'belgium': 'BE', 'brussels': 'BE', 'antwerp': 'BE', 'ghent': 'BE',
    // American countries
    'argentina': 'AR', 'buenos aires': 'AR', 'cordoba': 'AR', 'rosario': 'AR',
    'chile': 'CL', 'santiago': 'CL', 'valparaiso': 'CL', 'concepcion': 'CL',
    'colombia': 'CO', 'bogota': 'CO', 'medellin': 'CO', 'cali': 'CO',
    'peru': 'PE', 'lima': 'PE', 'arequipa': 'PE', 'cusco': 'PE',
    'venezuela': 'VE', 'caracas': 'VE', 'maracaibo': 'VE', 'valencia': 'VE',
    'new zealand': 'NZ', 'auckland': 'NZ', 'wellington': 'NZ', 'christchurch': 'NZ',
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
  const [countrySearch, setCountrySearch] = useState('');

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
      // African countries
      'ZA': '🇿🇦', 'NG': '🇳🇬', 'EG': '🇪🇬', 'KE': '🇰🇪', 'TZ': '🇹🇿',
      'GH': '🇬🇭', 'UG': '🇺🇬', 'DZ': '🇩🇿', 'MA': '🇲🇦',
      // Asian countries
      'TH': '🇹🇭', 'VN': '🇻🇳', 'PH': '🇵🇭', 'MY': '🇲🇾', 'ID': '🇮🇩',
      'PK': '🇵🇰', 'BD': '🇧🇩', 'TR': '🇹🇷', 'SA': '🇸🇦', 'AE': '🇦🇪', 'IR': '🇮🇷',
      // European countries
      'PL': '🇵🇱', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'GR': '🇬🇷',
      'PT': '🇵🇹', 'IE': '🇮🇪', 'AT': '🇦🇹', 'CZ': '🇨🇿', 'HU': '🇭🇺',
      'RO': '🇷🇴', 'UA': '🇺🇦', 'BE': '🇧🇪',
      // American countries
      'AR': '🇦🇷', 'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪',
      'NZ': '🇳🇿',
    };
    return flags[countryCode] || '🌍';
  };

  // Filter countries based on search
  const filteredCountries = countries.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Repository Explorer</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1">
        {/* Country Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              Countries
            </h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search countries..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
              {countrySearch && (
                <button
                  onClick={() => setCountrySearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* All Countries Option */}
            <div
              onClick={() => setSelectedCountry('all')}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                selectedCountry === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
              } border`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌍</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">All Countries</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Show repositories from all countries</div>
                </div>
              </div>
            </div>

            {/* Country List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredCountries.map(country => (
                <div
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCountry === country.code
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  } border`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCountryFlag(country.code)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{country.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{country.code}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                <Globe className="w-8 h-8 text-blue-500" />
                Repository Explorer
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Browse repositories by country and time period.</p>
            </div>

            {/* Filters */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6 sm:mb-8">
              <div className="text-blue-800 font-bold mb-4">🔍 FILTERS SECTION</div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
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
                <span className="ml-2 text-gray-600 dark:text-gray-400">Loading repositories...</span>
              </div>
            )}

            {/* Repositories Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredRepos.map((repo) => (
                  <Card key={repo.id} className="border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg mb-2 truncate text-gray-900 dark:text-gray-100">{repo.name}</CardTitle>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{repo.description}</p>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {formatTimeAgo(repo.created_at)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-blue mb-1">
                            <Star className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{formatNumber(repo.stars)}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Stars</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-green mb-1">
                            <GitFork className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{formatNumber(repo.forks)}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Forks</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 text-yellow mb-1">
                            <Eye className="w-3 h-3" />
                            <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{formatNumber(repo.watchers)}</span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Watchers</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 min-w-0">
                          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">Owner:</span>
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No repositories found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
