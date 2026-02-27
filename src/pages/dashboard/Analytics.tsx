import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, BarChart3, Activity, Users, Eye } from "lucide-react";

interface AnalyticsData {
  id: string;
  metric: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

const mockAnalytics: AnalyticsData[] = [
  {
    id: '1',
    metric: 'Total Repository Views',
    value: '1.2M',
    change: 23.5,
    trend: 'up',
    icon: Eye
  },
  {
    id: '2',
    metric: 'Active Contributors',
    value: '45.2K',
    change: 12.3,
    trend: 'up',
    icon: Users
  },
  {
    id: '3',
    metric: 'Code Commits',
    value: '892K',
    change: -5.2,
    trend: 'down',
    icon: Activity
  },
  {
    id: '4',
    metric: 'Average Engagement',
    value: '78%',
    change: 8.7,
    trend: 'up',
    icon: BarChart3
  }
];

export default function Analytics() {
  const [analytics] = useState<AnalyticsData[]>(mockAnalytics);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red" />;
      default: return <div className="w-4 h-4 bg-secondary rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green';
      case 'down': return 'text-red';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Analytics Dashboard</h1>
            <p className="text-secondary text-sm sm:text-base">Comprehensive insights into repository performance and engagement metrics.</p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {analytics.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-blue" />
                        <span className="text-sm text-secondary">{item.metric}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(item.trend)}
                        <span className={`text-sm font-medium ${getTrendColor(item.trend)}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{item.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue" />
                  Repository Growth Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-secondary border border-border rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p>Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue" />
                  Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-secondary border border-border rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p>Activity metrics would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
