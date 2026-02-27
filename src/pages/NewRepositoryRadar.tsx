import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RealRepositoryCard } from '@/components/repository/RealRepositoryCard';
import { LoadingGrid } from '@/components/ui/loading-skeleton';
import { ErrorState, EmptyState } from '@/components/ui/error-state';
import { 
  Globe, 
  Activity, 
  RefreshCw,
  Filter,
  Star,
  GitFork,
  Calendar
} from 'lucide-react';

interface RepositoryActivity {
  type: 'commit' | 'fork' | 'star' | 'issue' | 'pull_request' | 'release';
  timestamp: string;
  description: string;
  user: string;
  metadata?: {
    commit_hash?: string;
    issue_number?: number;
    pr_number?: number;
    tag?: string;
  };
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  open_issues_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
    location: string | null;
    country: string;
  };
  created_at: string;
  updated_at: string;
  pushed_at: string;
  created_ago: string;
  last_activity?: string;
  recent_activities: RepositoryActivity[];
  activity_score: number;
  health_score: number;
}

type SortOption = 'stars' | 'forks' | 'created' | 'updated' | 'activity' | 'health';
type FilterOption = 'all' | 'with-country' | 'with-language' | 'active' | 'healthy';
type TimeFilter = 'last-hour' | 'last-24h' | 'last-week' | 'last-month' | 'all-time';

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const generateMockActivities = (repoName: string): RepositoryActivity[] => {
  const activities: RepositoryActivity[] = [];
  const now = new Date();
  
  // Generate some mock activities
  for (let i = 0; i < 5; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const types: RepositoryActivity['type'][] = ['commit', 'fork', 'star', 'issue', 'pull_request', 'release'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    activities.push({
      type,
      timestamp: timestamp.toISOString(),
      description: `Mock ${type} activity for ${repoName}`,
      user: `user${Math.floor(Math.random() * 100)}`,
      metadata: type === 'commit' ? { commit_hash: `abc${Math.floor(Math.random() * 1000)}` } : undefined
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const calculateActivityScore = (repo: Omit<Repository, 'activity_score' | 'health_score' | 'recent_activities'>): number => {
  const now = new Date();
  const lastPush = new Date(repo.pushed_at);
  const daysSinceLastPush = (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
  
  // Base score from recent activity
  let score = Math.max(0, 100 - daysSinceLastPush * 2);
  
  // Bonus for stars and forks
  score += Math.min(20, repo.stargazers_count / 10);
  score += Math.min(20, repo.forks_count / 5);
  
  // Bonus for recent issues (active community)
  score += Math.min(10, repo.open_issues_count / 2);
  
  return Math.min(100, Math.round(score));
};

const calculateHealthScore = (repo: Omit<Repository, 'activity_score' | 'health_score' | 'recent_activities'>): number => {
  let score = 50; // Base score
  
  // Language presence
  if (repo.language) score += 10;
  
  // Description presence
  if (repo.description) score += 10;
  
  // Topics presence
  if (repo.topics.length > 0) score += 10;
  
  // Recent updates
  const now = new Date();
  const lastUpdate = new Date(repo.updated_at);
  const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate < 30) score += 10;
  
  // Balanced star/fork ratio
  const ratio = repo.forks_count / Math.max(1, repo.stargazers_count);
  if (ratio > 0.1 && ratio < 0.5) score += 10;
  
  return Math.min(100, score);
};

export default function NewRepositoryRadar() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('last-24h');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use GitHub API to search for repositories
      // Simplified query to avoid date formatting issues
      let searchQuery = 'stars:>10';
      
      // Add time filter if not "all-time"
      if (timeFilter !== 'all-time') {
        const now = new Date();
        let cutoffDate;
        
        switch (timeFilter) {
          case 'last-hour':
            cutoffDate = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'last-24h':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'last-week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'last-month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        }
        
        if (cutoffDate) {
          // GitHub search format: YYYY-MM-DD
          const dateStr = cutoffDate.toISOString().split('T')[0];
          searchQuery += ` created:>${dateStr}`;
        }
      }

      const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=stars&order=desc&per_page=50`;
      
      console.log('Fetching from:', apiUrl);
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json',
      };
      
      // Add GitHub token if available (for higher rate limits)
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      console.log('Environment variables:', import.meta.env);
      console.log('GitHub token exists:', !!githubToken);
      console.log('GitHub token length:', githubToken?.length || 0);
      
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
        console.log('Using GitHub token for authentication');
      } else {
        console.log('No GitHub token found - using unauthenticated requests');
      }

      const response = await fetch(apiUrl, { headers });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Transform GitHub API response to our Repository format
      const enhancedRepositories = (data.items || []).map((repo: any) => {
        const baseRepo = {
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          html_url: repo.html_url,
          description: repo.description,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language,
          topics: repo.topics || [],
          open_issues_count: repo.open_issues_count,
          watchers_count: repo.watchers_count,
          size: repo.size,
          default_branch: repo.default_branch || 'main',
          owner: {
            login: repo.owner.login,
            avatar_url: repo.owner.avatar_url,
            location: null, // GitHub API doesn't provide location in search results
            country: 'Unknown' // We'll need to fetch this separately if needed
          },
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          pushed_at: repo.pushed_at,
          created_ago: formatTimeAgo(new Date(repo.created_at)),
        };
        
        return {
          ...baseRepo,
          recent_activities: generateMockActivities(repo.name),
          activity_score: calculateActivityScore(baseRepo),
          health_score: calculateHealthScore(baseRepo),
          last_activity: baseRepo.pushed_at
        };
      });

      console.log('Processed repositories:', enhancedRepositories.length);
      setRepositories(enhancedRepositories);
      setLastUpdated(new Date());
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
  }, []);

  // Sort and filter repositories
  const processedRepositories = repositories
    .filter(repo => {
      // Time-based filtering
      const repoCreatedAt = new Date(repo.created_at);
      const now = new Date();
      
      switch (timeFilter) {
        case 'last-hour':
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          return repoCreatedAt >= oneHourAgo;
        case 'last-24h':
          const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          return repoCreatedAt >= twentyFourHoursAgo;
        case 'last-week':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return repoCreatedAt >= oneWeekAgo;
        case 'last-month':
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return repoCreatedAt >= oneMonthAgo;
        case 'all-time':
          return true;
        default:
          return true;
      }
      
      // Other filters
      if (filterBy === 'with-country') return repo.owner.country !== 'Unknown';
      if (filterBy === 'with-language') return repo.language !== null;
      if (filterBy === 'active') return repo.activity_score >= 50;
      if (filterBy === 'healthy') return repo.health_score >= 70;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'forks':
          return b.forks_count - a.forks_count;
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'updated':
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        case 'activity':
          return b.activity_score - a.activity_score;
        case 'health':
          return b.health_score - a.health_score;
        default:
          return 0;
      }
    });

  // Calculate statistics
  const getTimeFilterStats = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'last-hour':
        return {
          cutoff: new Date(now.getTime() - 60 * 60 * 1000),
          label: 'Last Hour',
          description: 'Repositories created in the last hour'
        };
      case 'last-24h':
        return {
          cutoff: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          label: 'Last 24 Hours',
          description: 'Repositories created in the last day'
        };
      case 'last-week':
        return {
          cutoff: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          label: 'Last Week',
          description: 'Repositories created in the last 7 days'
        };
      case 'last-month':
        return {
          cutoff: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          label: 'Last Month',
          description: 'Repositories created in the last 30 days'
        };
      default:
        return {
          cutoff: null,
          label: 'All Time',
          description: 'All repositories regardless of creation time'
        };
    }
  };

  const timeStats = getTimeFilterStats();
  const stats = {
    total: repositories.length,
    withCountry: repositories.filter(r => r.owner.country !== 'Unknown').length,
    withLanguage: repositories.filter(r => r.language).length,
    totalStars: repositories.reduce((sum, r) => sum + r.stargazers_count, 0),
    totalForks: repositories.reduce((sum, r) => sum + r.forks_count, 0)
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-8 w-64 bg-muted rounded mb-2"></div>
                <div className="h-4 w-96 bg-muted rounded"></div>
              </div>
              <div className="h-6 w-32 bg-muted rounded"></div>
            </div>
          </div>

          {/* Loading skeletons */}
          <LoadingGrid count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <ErrorState
            error={error}
            onRetry={fetchRepositories}
            title="Failed to load repositories"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-500" />
              New Repository Radar
            </h1>
            <p className="text-muted-foreground mt-2">
              Discover repositories created at specific times from around the world
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchRepositories}
              variant="outline"
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {lastUpdated && (
              <Badge className="text-xs bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200">
                Updated {lastUpdated.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total Repos</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-primary">{stats.withCountry}</div>
                <div className="text-xs text-muted-foreground">With Country</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-primary">{stats.totalStars.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Stars</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <GitFork className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-primary">{stats.totalForks.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Forks</div>
              </div>
            </div>
          </Card>
          
          {/* Time Filter Info */}
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-primary">{processedRepositories.length}</div>
                <div className="text-xs text-muted-foreground">{timeStats.label}</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{timeStats.description}</p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="forks">Most Forks</SelectItem>
                  <SelectItem value="created">Newest First</SelectItem>
                  <SelectItem value="updated">Recently Updated</SelectItem>
                  <SelectItem value="activity">Most Active</SelectItem>
                  <SelectItem value="health">Healthiest</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-hour">Last Hour</SelectItem>
                  <SelectItem value="last-24h">Last 24 Hours</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Repositories</SelectItem>
                  <SelectItem value="with-country">With Country Data</SelectItem>
                  <SelectItem value="with-language">With Language</SelectItem>
                  <SelectItem value="active">Active (50+ score)</SelectItem>
                  <SelectItem value="healthy">Healthy (70+ score)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Badge variant="secondary" className="text-xs">
              {processedRepositories.length} of {repositories.length} shown
            </Badge>
          </div>
        </Card>

        {/* Repository List */}
        <div className="space-y-4">
          {processedRepositories.length === 0 ? (
            <EmptyState
              title="No repositories match your filters"
              description="Try adjusting your filters or check back later for new repositories."
            />
          ) : (
            processedRepositories.map((repository) => (
              <RealRepositoryCard
                key={repository.id}
                repository={repository}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
