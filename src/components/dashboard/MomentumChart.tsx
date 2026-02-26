import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface ChartDataPoint {
  date: string;
  emergingRockets: number;
  silentClimbers: number;
  coolingDown: number;
  experimentalSpike: number;
}

interface MomentumChartProps {
  className?: string;
  data: ChartDataPoint[];
  visibleLines?: {
    emergingRockets?: boolean;
    silentClimbers?: boolean;
    coolingDown?: boolean;
    experimentalSpike?: boolean;
  };
  onLineToggle?: (line: keyof typeof defaultVisibleLines) => void;
}

const defaultVisibleLines = {
  emergingRockets: true,
  silentClimbers: true,
  coolingDown: true,
  experimentalSpike: true,
};

const lineConfig = {
  emergingRockets: {
    color: '#2f81f7',
    name: 'Emerging Rockets',
    strokeWidth: 2,
  },
  silentClimbers: {
    color: '#3fb950',
    name: 'Silent Climbers',
    strokeWidth: 2,
  },
  coolingDown: {
    color: '#f85149',
    name: 'Cooling Down',
    strokeWidth: 2,
  },
  experimentalSpike: {
    color: '#d29922',
    name: 'Experimental Spike',
    strokeWidth: 2,
  },
};

export function MomentumChart({
  className,
  data,
  visibleLines = defaultVisibleLines,
  onLineToggle,
}: MomentumChartProps) {

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-primary mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-secondary">{entry.name}:</span>
              <span className="text-primary font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {Object.entries(lineConfig).map(([key, config]) => {
          const isVisible = visibleLines[key as keyof typeof visibleLines];
          return (
            <button
              key={key}
              onClick={() => onLineToggle?.(key as keyof typeof defaultVisibleLines)}
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-md border transition-colors',
                'hover:bg-surface',
                isVisible
                  ? 'bg-surface border-blue text-primary'
                  : 'border-border text-secondary opacity-60',
                'focus:outline-none focus:ring-2 focus:ring-blue'
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-sm font-medium">{config.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-primary">Historical Momentum Trends</h2>
        <p className="text-sm text-secondary mt-1">
          Track repository momentum over time
        </p>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#30363d"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="#8b949e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {visibleLines.emergingRockets && (
              <Line
                type="monotone"
                dataKey="emergingRockets"
                stroke={lineConfig.emergingRockets.color}
                strokeWidth={lineConfig.emergingRockets.strokeWidth}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: lineConfig.emergingRockets.color,
                  stroke: '#0d1117',
                  strokeWidth: 2,
                }}
              />
            )}
            
            {visibleLines.silentClimbers && (
              <Line
                type="monotone"
                dataKey="silentClimbers"
                stroke={lineConfig.silentClimbers.color}
                strokeWidth={lineConfig.silentClimbers.strokeWidth}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: lineConfig.silentClimbers.color,
                  stroke: '#0d1117',
                  strokeWidth: 2,
                }}
              />
            )}
            
            {visibleLines.coolingDown && (
              <Line
                type="monotone"
                dataKey="coolingDown"
                stroke={lineConfig.coolingDown.color}
                strokeWidth={lineConfig.coolingDown.strokeWidth}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: lineConfig.coolingDown.color,
                  stroke: '#0d1117',
                  strokeWidth: 2,
                }}
              />
            )}
            
            {visibleLines.experimentalSpike && (
              <Line
                type="monotone"
                dataKey="experimentalSpike"
                stroke={lineConfig.experimentalSpike.color}
                strokeWidth={lineConfig.experimentalSpike.strokeWidth}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: lineConfig.experimentalSpike.color,
                  stroke: '#0d1117',
                  strokeWidth: 2,
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <CustomLegend />
    </div>
  );
}
