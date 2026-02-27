import type { Repository } from '@/types/repository.js';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, TrendingUp, TrendingDown, Minus, Star, GitFork, Clock } from 'lucide-react';
import { detectCountry } from '@/lib/countryDetection.js';

interface RepositoryCardProps {
  repository: Repository;
  compact?: boolean;
}

export function RepositoryCard({ repository, compact = false }: RepositoryCardProps) {
  const countryInfo = detectCountry(repository.owner.location);
  const createdTime = new Date(repository.createdAt);
  const now = new Date();
  const hoursAgo = Math.floor((now.getTime() - createdTime.getTime()) / (1000 * 60 * 60));
  
  const formatTimeAgo = (hours: number) => {
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getTrendIcon = () => {
    switch (repository.trendDirection) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 80) return 'text-green-500';
    if (momentum >= 60) return 'text-yellow-500';
    if (momentum >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  if (compact) {
    return (
      <Card className="p-3 hover:bg-surface/50 transition-colors cursor-pointer border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:text-blue-400 transition-colors truncate"
              >
                {repository.fullName}
              </a>
              {getTrendIcon()}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{countryInfo.flag}</span>
              <span>{repository.language || 'Unknown'}</span>
              <span>•</span>
              <span>{formatTimeAgo(hoursAgo)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{repository.stars}</span>
            </div>
            <div className={`font-medium ${getMomentumColor(repository.momentum)}`}>
              {repository.momentum}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:bg-surface/50 transition-colors cursor-pointer border-border/50">
      <div className="space-y-3">
        {/* Header with repo name and trend */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <a
                href={repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-primary hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                {repository.fullName}
                <ExternalLink className="h-3 w-3 opacity-60 hover:opacity-100" />
              </a>
              {getTrendIcon()}
            </div>
            
            {/* Description */}
            {repository.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {repository.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Country badge */}
          <Badge variant="secondary" className="flex items-center gap-1">
            <span>{countryInfo.flag}</span>
            <span>{countryInfo.country}</span>
          </Badge>

          {/* Language badge */}
          {repository.language && (
            <Badge variant="outline" className="text-xs">
              {repository.language}
            </Badge>
          )}

          {/* Topics */}
          {repository.topics.slice(0, 2).map((topic) => (
            <Badge key={topic} variant="secondary" className="text-xs">
              {topic}
            </Badge>
          ))}

          {/* Time ago */}
          <div className="flex items-center gap-1 text-muted-foreground ml-auto">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(hoursAgo)}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-primary">{repository.stars.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4 text-blue-500" />
              <span className="text-primary">{repository.forks.toLocaleString()}</span>
            </div>
          </div>

          {/* Momentum score */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Momentum</span>
            <div className={`text-lg font-bold ${getMomentumColor(repository.momentum)}`}>
              {repository.momentum}
            </div>
          </div>
        </div>

        {/* Growth indicators */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span>+{repository.growthIndicators.starsGrowth} stars</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="h-3 w-3 text-blue-500" />
            <span>+{repository.growthIndicators.forksGrowth} forks</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Activity: {repository.growthIndicators.activityScore}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
