import { cn } from '@/lib/utils';
import { Star, GitFork, Eye, GitPullRequest, ExternalLink } from 'lucide-react';

export interface Repository {
  id: string;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;
  pullRequests: number;
  starDelta: number;
  contributorDelta: number;
  issueDelta: number;
  momentumScore: number;
  categories: string[];
  isOpenSource: boolean;
  lastUpdated: string;
}

interface RepoCardProps {
  className?: string;
  repo: Repository;
}

const getMomentumColor = (score: number) => {
  if (score >= 1000) return 'text-green';
  if (score >= 500) return 'text-yellow';
  if (score >= 100) return 'text-blue';
  return 'text-secondary';
};

const getDeltaColor = (delta: number) => {
  if (delta > 0) return 'text-green';
  if (delta < 0) return 'text-red';
  return 'text-secondary';
};

const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const formatDelta = (num: number) => {
  const sign = num > 0 ? '+' : num < 0 ? '' : '';
  return `${sign}${formatNumber(num)}`;
};


export function RepoCard({ className, repo }: RepoCardProps) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-3 sm:p-4 transition-all duration-200 w-full',
        'hover:border-blue hover:bg-surface',
        'focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary text-sm sm:text-base truncate">
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue transition-colors flex items-center gap-1"
            >
              {repo.name}
              <ExternalLink className="w-3 h-3 text-secondary flex-shrink-0" />
            </a>
          </h3>
        </div>
        
        {/* Momentum Score Badge */}
        <div className={cn(
          'px-2 py-1 rounded text-xs font-medium border flex-shrink-0',
          getMomentumColor(repo.momentumScore),
          'bg-surface'
        )}>
          {formatNumber(repo.momentumScore)}
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-xs sm:text-sm text-secondary mb-2 sm:mb-3 line-clamp-2">
          {repo.description}
        </p>
      )}

      {/* Categories */}
      {repo.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
          {repo.categories.slice(0, 2).map((category) => (
            <span
              key={category}
              className="px-2 py-1 text-xs bg-surface border border-border rounded text-secondary hover:text-primary transition-colors"
            >
              {category}
            </span>
          ))}
          {repo.categories.length > 2 && (
            <span className="px-2 py-1 text-xs bg-surface border border-border rounded text-secondary">
              +{repo.categories.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Language Badge */}
      {repo.language && (
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <span className="text-xs text-secondary">Language:</span>
          <span className="px-2 py-1 text-xs bg-surface border border-border rounded text-primary">
            {repo.language}
          </span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-secondary flex-shrink-0" />
          <span className="text-primary truncate">{formatNumber(repo.stars)}</span>
          <span className={cn(getDeltaColor(repo.starDelta), 'flex-shrink-0')}>
            ({formatDelta(repo.starDelta)})
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <GitFork className="w-3 h-3 text-secondary flex-shrink-0" />
          <span className="text-primary truncate">{formatNumber(repo.forks)}</span>
          <span className="text-secondary flex-shrink-0">forks</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Eye className="w-3 h-3 text-secondary flex-shrink-0" />
          <span className="text-primary truncate">{formatNumber(repo.watchers)}</span>
          <span className="text-secondary flex-shrink-0">watchers</span>
        </div>
        
        <div className="flex items-center gap-1">
          <GitPullRequest className="w-3 h-3 text-secondary flex-shrink-0" />
          <span className="text-primary truncate">{formatNumber(repo.pullRequests)}</span>
          <span className="text-secondary flex-shrink-0">PRs</span>
        </div>
      </div>

      {/* Open Source Indicator */}
      {repo.isOpenSource && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
          <span className="text-xs text-green flex items-center gap-1">
            <span className="w-2 h-2 bg-green rounded-full flex-shrink-0"></span>
            Open Source
          </span>
        </div>
      )}
    </div>
  );
}