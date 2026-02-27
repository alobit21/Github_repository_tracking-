import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Star, GitFork, Clock, MapPin, Activity, Zap, Heart, GitCommit, GitPullRequest, AlertCircle, Package } from 'lucide-react';

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

interface RealRepositoryCardProps {
  repository: {
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
  };
}

const getActivityIcon = (type: RepositoryActivity['type']) => {
  switch (type) {
    case 'commit': return GitCommit;
    case 'fork': return GitFork;
    case 'star': return Star;
    case 'issue': return AlertCircle;
    case 'pull_request': return GitPullRequest;
    case 'release': return Package;
    default: return Activity;
  }
};

const getActivityColor = (type: RepositoryActivity['type']) => {
  switch (type) {
    case 'commit': return 'text-green-500';
    case 'fork': return 'text-purple-500';
    case 'star': return 'text-yellow-500';
    case 'issue': return 'text-red-500';
    case 'pull_request': return 'text-blue-500';
    case 'release': return 'text-orange-500';
    default: return 'text-gray-500';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export function RealRepositoryCard({ repository }: RealRepositoryCardProps) {
  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Netherlands': '🇳🇱',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Brazil': '🇧🇷',
      'India': '🇮🇳',
      'China': '🇨🇳',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Poland': '🇵🇱',
      'Russia': '🇷🇺',
      'Turkey': '🇹🇷',
      'Israel': '🇮🇱',
      'United Arab Emirates': '🇦🇪',
      'Mexico': '🇲🇽',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'South Africa': '🇿🇦',
      'Egypt': '🇪🇬',
      'Nigeria': '🇳🇬',
      'Kenya': '🇰🇪',
      'New Zealand': '🇳🇿',
      'Unknown': '🌍'
    };
    return flags[country] || '🌍';
  };

  return (
    <Card className="p-6 hover:bg-surface/50 transition-all duration-200 border-border/50 hover:border-border/80">
      <div className="space-y-4">
        {/* Header with repo name and owner */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={repository.owner.avatar_url}
                alt={`${repository.owner.login} avatar`}
                className="w-8 h-8 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <a
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-primary hover:text-blue-400 transition-colors truncate block"
                >
                  {repository.full_name}
                </a>
                <p className="text-sm text-muted-foreground">by {repository.owner.login}</p>
              </div>
            </div>
            
            {/* Description */}
            {repository.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {repository.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Country badge */}
          <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">
            <span>{getCountryFlag(repository.owner.country)}</span>
            <span>{repository.owner.country}</span>
          </Badge>

          {/* Language badge */}
          {repository.language && (
            <Badge className="text-xs bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
              {repository.language}
            </Badge>
          )}

          {/* Topics */}
          {repository.topics.slice(0, 3).map((topic) => (
            <Badge key={topic} className="text-xs bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200">
              {topic}
            </Badge>
          ))}

          {/* Time ago */}
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Clock className="h-3 w-3" />
            <span>{repository.created_ago}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-primary font-medium">{repository.stargazers_count.toLocaleString()}</span>
              <span className="text-muted-foreground">stars</span>
            </div>
            <div className="flex items-center gap-2">
              <GitFork className="h-4 w-4 text-blue-500" />
              <span className="text-primary font-medium">{repository.forks_count.toLocaleString()}</span>
              <span className="text-muted-foreground">forks</span>
            </div>
          </div>

          {/* External link */}
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View on GitHub
          </a>
        </div>

        {/* Activity & Health Scores */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            {/* Activity Score */}
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary">Activity</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        repository.activity_score >= 70 ? 'bg-green-500' : 
                        repository.activity_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${repository.activity_score}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{repository.activity_score}</span>
                </div>
              </div>
            </div>

            {/* Health Score */}
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary">Health</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        repository.health_score >= 70 ? 'bg-green-500' : 
                        repository.health_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${repository.health_score}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{repository.health_score}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Last Activity */}
          {repository.last_activity && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span>Last: {formatTimeAgo(repository.last_activity)}</span>
            </div>
          )}
        </div>

        {/* Recent Activities */}
        {repository.recent_activities.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Recent Activity</span>
            </div>
            <div className="space-y-2">
              {repository.recent_activities.slice(0, 3).map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <Icon className={`h-3 w-3 ${getActivityColor(activity.type)}`} />
                    <span className="text-muted-foreground">{activity.description}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Owner location */}
        {repository.owner.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
            <MapPin className="h-3 w-3" />
            <span>{repository.owner.location}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
