import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendData {
  id: string;
  name: string;
  category: string;
  momentum: number;
  change: number;
  direction: 'up' | 'down' | 'neutral';
}

const mockTrends: TrendData[] = [
  { id: '1', name: 'React 19', category: 'Frontend', momentum: 8921, change: 15.2, direction: 'up' },
  { id: '2', name: 'Rust WebAssembly', category: 'Infrastructure', momentum: 7234, change: 23.8, direction: 'up' },
  { id: '3', name: 'Next.js 15', category: 'Frontend', momentum: 6543, change: -5.4, direction: 'down' },
  { id: '4', name: 'TypeScript 5.4', category: 'DevTools', momentum: 5876, change: 8.9, direction: 'up' },
  { id: '5', name: 'Vue 3.4', category: 'Frontend', momentum: 4321, change: 2.1, direction: 'up' },
  { id: '6', name: 'Go 1.22', category: 'Infrastructure', momentum: 3876, change: -1.2, direction: 'down' },
  { id: '7', name: 'Python 3.12', category: 'AI / ML', momentum: 3456, change: 0.0, direction: 'neutral' },
  { id: '8', name: 'Docker 25', category: 'Infrastructure', momentum: 2987, change: 12.3, direction: 'up' },
];

export default function Trends() {
  const [trends] = useState<TrendData[]>(mockTrends);

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red" />;
      default: return <Minus className="w-4 h-4 text-secondary" />;
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-green';
      case 'down': return 'text-red';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="trends"
          onItemClick={(item) => console.log('Navigate to:', item.id)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Technology Trends</h1>
              <p className="text-secondary">Track momentum across different technologies and ecosystems.</p>
            </div>

            {/* Trends Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend) => (
                <Card key={trend.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{trend.name}</CardTitle>
                      <Badge variant="secondary">{trend.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-secondary">Momentum Score</p>
                          <p className="text-2xl font-bold text-primary">{trend.momentum.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(trend.direction)}
                          <span className={`font-medium ${getDirectionColor(trend.direction)}`}>
                            {trend.change > 0 ? '+' : ''}{trend.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
