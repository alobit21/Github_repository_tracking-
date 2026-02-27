import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RepositoryCard } from '@/components/repository/RepositoryCard.js';
import { CountryFilter } from '@/components/filters/CountryFilter.js';
import { mockGlobalDiscoveryData } from '@/data/mockData.js';
import type { FilterOptions } from '@/types/repository.js';
import { 
  Globe, 
  TrendingUp, 
  Gem, 
  Activity, 
  BarChart3, 
  Eye, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

export default function GlobalDiscovery() {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    countries: [],
    languages: [],
    minStars: 0,
    timeRange: '24h',
    sortBy: 'momentum',
    sortOrder: 'desc'
  });

  const filteredRepositories = useMemo(() => {
    let filtered = [...mockGlobalDiscoveryData.repositories];

    // Filter by countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(repo => {
        const countryInfo = mockGlobalDiscoveryData.countryStats.find(
          stat => stat.country === repo.inferredCountry
        );
        return countryInfo && selectedCountries.includes(countryInfo.countryCode);
      });
    }

    // Filter by minimum stars
    if (filterOptions.minStars > 0) {
      filtered = filtered.filter(repo => repo.stars >= filterOptions.minStars);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: number;
      let bValue: number;

      switch (filterOptions.sortBy) {
        case 'momentum':
          aValue = a.momentum;
          bValue = b.momentum;
          break;
        case 'stars':
          aValue = a.stars;
          bValue = b.stars;
          break;
        case 'forks':
          aValue = a.forks;
          bValue = b.forks;
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = a.momentum;
          bValue = b.momentum;
      }

      return filterOptions.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

    return filtered;
  }, [selectedCountries, filterOptions]);

  const topRepositories = filteredRepositories.slice(0, 10);
  const hiddenGems = mockGlobalDiscoveryData.hiddenGems.filter(repo => 
    selectedCountries.length === 0 || 
    selectedCountries.includes(mockGlobalDiscoveryData.countryStats.find(s => s.country === repo.inferredCountry)?.countryCode || '')
  );
  const breakoutWatchlist = mockGlobalDiscoveryData.breakoutWatchlist.filter(repo => 
    selectedCountries.length === 0 || 
    selectedCountries.includes(mockGlobalDiscoveryData.countryStats.find(s => s.country === repo.inferredCountry)?.countryCode || '')
  );

  const getTrendIcon = (direction: 'up' | 'neutral' | 'down') => {
    switch (direction) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-3">
              <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              Global Discovery
            </h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Explore newly created GitHub repositories from around the world
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Badge variant="secondary" className="text-sm">
              {mockGlobalDiscoveryData.totalRepositories} new repos
            </Badge>
            <Badge variant="outline" className="text-sm">
              Last updated: {new Date(mockGlobalDiscoveryData.lastUpdated).toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-4">
            <CountryFilter
              selectedCountries={selectedCountries}
              onCountriesChange={setSelectedCountries}
            />
            
            {/* Additional Filters */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Sort By</label>
                  <Select
                    value={filterOptions.sortBy}
                    onValueChange={(value) => setFilterOptions(prev => ({ ...prev, sortBy: value as any }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="momentum">Momentum</SelectItem>
                      <SelectItem value="stars">Stars</SelectItem>
                      <SelectItem value="forks">Forks</SelectItem>
                      <SelectItem value="created">Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Min Stars</label>
                  <Select
                    value={filterOptions.minStars.toString()}
                    onValueChange={(value) => setFilterOptions(prev => ({ ...prev, minStars: parseInt(value) }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any</SelectItem>
                      <SelectItem value="10">10+</SelectItem>
                      <SelectItem value="50">50+</SelectItem>
                      <SelectItem value="100">100+</SelectItem>
                      <SelectItem value="500">500+</SelectItem>
                      <SelectItem value="1000">1000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">View Mode</label>
                  <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="table">Table</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-6">
            <Tabs defaultValue="trending" className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto p-1">
                <TabsTrigger value="trending" className="flex-col gap-1 p-2 text-xs sm:text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Trending</span>
                  <span className="sm:hidden">Trend</span>
                </TabsTrigger>
                <TabsTrigger value="regional" className="flex-col gap-1 p-2 text-xs sm:text-sm">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Regional</span>
                  <span className="sm:hidden">Region</span>
                </TabsTrigger>
                <TabsTrigger value="gems" className="flex-col gap-1 p-2 text-xs sm:text-sm">
                  <Gem className="h-4 w-4" />
                  <span className="hidden sm:inline">Hidden Gems</span>
                  <span className="sm:hidden">Gems</span>
                </TabsTrigger>
                <TabsTrigger value="breakout" className="flex-col gap-1 p-2 text-xs sm:text-sm">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Breakout</span>
                  <span className="sm:hidden">Break</span>
                </TabsTrigger>
                <TabsTrigger value="tech" className="flex-col gap-1 p-2 text-xs sm:text-sm">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Tech Stack</span>
                  <span className="sm:hidden">Tech</span>
                </TabsTrigger>
              </TabsList>

              {/* Trending Repositories */}
              <TabsContent value="trending" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">🔥 Top New Repositories Today</h2>
                  <Badge variant="secondary">{topRepositories.length} repositories</Badge>
                </div>
                <div className={viewMode === 'cards' ? 'space-y-3' : ''}>
                  {viewMode === 'cards' ? (
                    topRepositories.map((repo) => (
                      <RepositoryCard key={repo.id} repository={repo} />
                    ))
                  ) : (
                    <Card className="p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left p-2">Repository</th>
                              <th className="text-left p-2">Country</th>
                              <th className="text-left p-2">Language</th>
                              <th className="text-left p-2">Stars</th>
                              <th className="text-left p-2">Forks</th>
                              <th className="text-left p-2">Momentum</th>
                              <th className="text-left p-2">Trend</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topRepositories.map((repo) => (
                              <tr key={repo.id} className="border-b border-border/50 hover:bg-surface/50">
                                <td className="p-2">
                                  <a href={repo.url} target="_blank" rel="noopener noreferrer" 
                                     className="text-primary hover:text-blue-400 font-medium">
                                    {repo.fullName}
                                  </a>
                                </td>
                                <td className="p-2">{repo.inferredCountry}</td>
                                <td className="p-2">{repo.language || '-'}</td>
                                <td className="p-2">{repo.stars.toLocaleString()}</td>
                                <td className="p-2">{repo.forks.toLocaleString()}</td>
                                <td className="p-2">
                                  <span className={`font-bold ${
                                    repo.momentum >= 80 ? 'text-green-500' :
                                    repo.momentum >= 60 ? 'text-yellow-500' :
                                    repo.momentum >= 40 ? 'text-orange-500' : 'text-red-500'
                                  }`}>
                                    {repo.momentum}
                                  </span>
                                </td>
                                <td className="p-2">{getTrendIcon(repo.trendDirection)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Regional Momentum */}
              <TabsContent value="regional" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">📈 Regional Momentum</h2>
                  <Badge variant="secondary">{mockGlobalDiscoveryData.regionalMomentum.length} regions</Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockGlobalDiscoveryData.regionalMomentum.map((region) => (
                    <Card key={region.countryCode} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{region.flag}</span>
                          <div>
                            <h3 className="font-semibold text-primary text-sm sm:text-base">{region.country}</h3>
                            <p className="text-xs text-muted-foreground">{region.countryCode}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-500">+{region.growthRate}%</div>
                          <div className="text-xs text-muted-foreground">growth rate</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">New Repos</div>
                          <div className="font-semibold">{region.newRepositoriesCount}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Stars</div>
                          <div className="font-semibold">{region.averageStars.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Top Language</div>
                          <div className="font-semibold">{region.topLanguage}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Momentum</div>
                          <div className="font-semibold text-green-500">High</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Hidden Gems */}
              <TabsContent value="gems" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">💎 Hidden Gems</h2>
                  <Badge variant="secondary">{hiddenGems.length} repositories</Badge>
                </div>
                <div className="space-y-3">
                  {hiddenGems.map((repo) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </div>
              </TabsContent>

              {/* Breakout Watchlist */}
              <TabsContent value="breakout" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">🚀 Breakout Watchlist</h2>
                  <Badge variant="secondary">{breakoutWatchlist.length} repositories</Badge>
                </div>
                <div className="space-y-3">
                  {breakoutWatchlist.map((repo) => (
                    <RepositoryCard key={repo.id} repository={repo} />
                  ))}
                </div>
              </TabsContent>

              {/* Technology Distribution */}
              <TabsContent value="tech" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">🧠 Technology Distribution by Region</h2>
                  <Badge variant="secondary">{mockGlobalDiscoveryData.technologyDistribution.length} technologies</Badge>
                </div>
                <div className="space-y-3">
                  {mockGlobalDiscoveryData.technologyDistribution.map((tech) => (
                    <Card key={tech.language} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-primary">{tech.language}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{tech.count} repos</Badge>
                          <Badge variant="outline">{tech.percentage.toFixed(1)}%</Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tech.countries.map((country) => (
                          <Badge key={country.country} variant="outline" className="text-xs">
                            {country.country} ({country.count})
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
