import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Star } from 'lucide-react';

const showcaseItems = [
  {
    title: 'Real-Time Momentum Tracking',
    description: 'Monitor repository growth patterns as they happen, with instant alerts for significant changes.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop&auto=format',
    icon: TrendingUp,
    badge: 'Live Data'
  },
  {
    title: 'Category-Based Intelligence',
    description: 'Filter trends by ecosystem categories like AI/ML, DevTools, Infrastructure, and Web3.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop&auto=format',
    icon: BarChart3,
    badge: 'Smart Filtering'
  },
  {
    title: 'Developer Community Insights',
    description: 'Track contributor velocity, issue resolution patterns, and community engagement metrics.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop&auto=format',
    icon: Users,
    badge: 'Community Data'
  },
  {
    title: 'Trend Prediction Engine',
    description: 'Our AI analyzes historical patterns to predict emerging trends before they go mainstream.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop&auto=format',
    icon: Star,
    badge: 'AI-Powered'
  }
];

export function Showcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            See Signal Detection in Action
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Powerful analytics that turn raw GitHub data into actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="border-border overflow-hidden group hover:border-blue transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">
                    {item.badge}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <item.icon className="w-5 h-5 text-blue" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-secondary text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
