import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { RepoCard, type Repository } from './RepoCard';

interface SectionProps {
  className?: string;
  title: string;
  repos: Repository[];
  accentColor?: 'blue' | 'green' | 'yellow' | 'red';
  onViewAll?: () => void;
  maxItems?: number;
}

const accentColors = {
  blue: 'border-blue',
  green: 'border-green',
  yellow: 'border-yellow',
  red: 'border-red',
};

export function Section({
  className,
  title,
  repos,
  accentColor = 'blue',
  onViewAll,
  maxItems,
}: SectionProps) {
  if (!repos.length) return null;

  const displayRepos = maxItems ? repos.slice(0, maxItems) : repos;
  const hasMore = maxItems && repos.length > maxItems;

  return (
    <section className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          <span className="px-2 py-1 text-xs bg-surface border border-border rounded text-secondary">
            {repos.length}
          </span>
        </div>
        
        {(onViewAll || hasMore) && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-sm text-blue hover:text-primary transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Accent Line */}
      <div className={cn('h-px bg-border', accentColors[accentColor])} />

      {/* Repository Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayRepos.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {/* Show More Indicator */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={onViewAll}
            className="text-sm text-blue hover:text-primary transition-colors"
          >
            Show {repos.length - maxItems} more repositories
          </button>
        </div>
      )}
    </section>
  );
}