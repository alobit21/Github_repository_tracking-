import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiData {
  title: string;
  value: number;
  delta: number;
  deltaType?: 'increase' | 'decrease' | 'neutral';
  accentColor?: 'blue' | 'green' | 'yellow' | 'red';
}

interface KpiCardProps {
  className?: string;
  data: KpiData;
}

const accentColors = {
  blue: 'border-blue',
  green: 'border-green',
  yellow: 'border-yellow',
  red: 'border-red',
};

export function KpiCard({ className, data }: KpiCardProps) {
  const {
    title,
    value,
    delta,
    deltaType = delta > 0 ? 'increase' : delta < 0 ? 'decrease' : 'neutral',
    accentColor = 'blue'
  } = data;

  const getDeltaIcon = () => {
    switch (deltaType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getDeltaColor = () => {
    switch (deltaType) {
      case 'increase':
        return 'text-green';
      case 'decrease':
        return 'text-red';
      default:
        return 'text-secondary';
    }
  };

  const formatValue = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDelta = (num: number) => {
    const absDelta = Math.abs(num);
    const sign = deltaType === 'increase' ? '+' : deltaType === 'decrease' ? '-' : '';
    
    if (absDelta >= 1000000) {
      return `${sign}${(absDelta / 1000000).toFixed(1)}M`;
    } else if (absDelta >= 1000) {
      return `${sign}${(absDelta / 1000).toFixed(1)}K`;
    }
    return `${sign}${absDelta}`;
  };

  return (
    <div className={cn(
      'relative bg-card border border-border rounded-lg p-6 transition-all duration-200',
      'hover:border-border/80 hover:bg-surface',
      className
    )}>
      {/* Accent line */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1 rounded-t-lg',
        accentColors[accentColor]
      )} />
      
      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="text-sm font-medium text-secondary">{title}</h3>
        
        {/* Value */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatValue(value)}
          </span>
        </div>
        
        {/* Delta */}
        <div className="flex items-center gap-2">
          <div className={cn('flex items-center gap-1', getDeltaColor())}>
            {getDeltaIcon()}
            <span className="text-sm font-medium">
              {formatDelta(delta)}
            </span>
          </div>
          <span className="text-xs text-secondary">vs yesterday</span>
        </div>
      </div>
    </div>
  );
}
