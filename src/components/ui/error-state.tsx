import { Card } from './card';
import { Button } from './button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  showRetry?: boolean;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title = 'Something went wrong',
  showRetry = true 
}: ErrorStateProps) {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {error}
          </p>
        </div>

        {showRetry && onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
}

export function ApiErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Unable to fetch repositories"
      error="We couldn't connect to the GitHub API. This might be due to rate limiting or a network issue. Please try again in a few moments."
      onRetry={onRetry}
    />
  );
}

export function EmptyState({ 
  title = 'No repositories found',
  description = 'No new repositories were created in the last 24 hours.'
}: { 
  title?: string;
  description?: string;
}) {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <div className="text-4xl">🔍</div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
