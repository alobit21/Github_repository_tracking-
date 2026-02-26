import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface CategoryData {
  category: string;
  count: number;
  color: string;
}

interface CategoryDistributionProps {
  className?: string;
  data: CategoryData[];
  onCategoryClick?: (category: string) => void;
}

const defaultColors = [
  '#2f81f7', // blue
  '#3fb950', // green
  '#d29922', // yellow
  '#f85149', // red
  '#8b949e', // secondary
  '#484f58', // muted
  '#1f6feb', // accent
  '#58a6ff', // light blue
  '#79c0ff', // lighter blue
  '#a5d6ff', // very light blue
];

export function CategoryDistribution({ 
  className, 
  data, 
  onCategoryClick 
}: CategoryDistributionProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-primary">
            {payload[0].payload.category}
          </p>
          <p className="text-xs text-secondary">
            {payload[0].value} repositories
          </p>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (data && data.activePayload && onCategoryClick) {
      onCategoryClick(data.activePayload[0].payload.category);
    }
  };

  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary">Category Distribution</h3>
        <p className="text-sm text-secondary mt-1">
          Repository breakdown by category
        </p>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={handleBarClick}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#30363d"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="category"
              stroke="#8b949e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="#2f81f7"
              radius={[2, 2, 0, 0]}
              className="cursor-pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {data.map((item, index) => (
          <button
            key={item.category}
            onClick={() => onCategoryClick?.(item.category)}
            className={cn(
              'flex items-center gap-2 px-2 py-1 rounded text-xs border transition-colors',
              'hover:bg-surface hover:border-blue',
              'focus:outline-none focus:ring-2 focus:ring-blue'
            )}
          >
            <div
              className="w-2 h-2 rounded"
              style={{ backgroundColor: item.color || defaultColors[index % defaultColors.length] }}
            />
            <span className="text-secondary">{item.category}</span>
            <span className="text-primary">({item.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
