import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Users, GitBranch } from 'lucide-react';

const analyticsData = [
  {
    title: 'Emerging Rockets',
    value: '2,514',
    change: '+127%',
    trend: 'up',
    description: 'Repositories with explosive growth',
    icon: TrendingUp,
    color: 'text-green'
  },
  {
    title: 'Active Contributors',
    value: '8.7K',
    change: '+23%',
    trend: 'up',
    description: 'Developers contributing daily',
    icon: Users,
    color: 'text-blue'
  },
  {
    title: 'Total Commits',
    value: '45.2K',
    change: '+45%',
    trend: 'up',
    description: 'Code changes this week',
    icon: GitBranch,
    color: 'text-yellow'
  },
  {
    title: 'Issue Resolution',
    value: '92%',
    change: '+8%',
    trend: 'up',
    description: 'Issues resolved within 24h',
    icon: Activity,
    color: 'text-green'
  }
];

export function Analytics() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Real-Time Analytics Dashboard
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Monitor key metrics across the entire GitHub ecosystem in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {analyticsData.map((item, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <Badge 
                    variant={item.trend === 'up' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.change}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-primary">
                    {item.value}
                  </div>
                  <p className="text-sm text-secondary">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Preview Image */}
        <Card className="border-border overflow-hidden">
          <div className="relative aspect-video">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&auto=format"
              alt="Analytics Dashboard Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-primary mb-2">
                  Comprehensive Analytics Platform
                </h3>
                <p className="text-secondary max-w-2xl">
                  From repository-level insights to ecosystem-wide trends, get the complete picture of GitHub momentum.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
