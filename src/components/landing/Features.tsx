import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Filter, 
  BarChart3, 
  Code, 
  AlertTriangle, 
  Zap 
} from 'lucide-react';

const features = [
  {
    icon: TrendingUp,
    title: 'Momentum Scoring Engine',
    description: 'Proprietary algorithm calculates repository momentum based on stars, contributions, and issue velocity.'
  },
  {
    icon: Filter,
    title: 'Category-Based Filtering',
    description: 'Filter trends by ecosystem categories like AI/ML, DevTools, Infrastructure, and Web3.'
  },
  {
    icon: BarChart3,
    title: 'Historical Trend Visualization',
    description: 'Track momentum over time with interactive charts and trend analysis.'
  },
  {
    icon: Code,
    title: 'Open Source Detection',
    description: 'Automatically identify and categorize open-source projects across all ecosystems.'
  },
  {
    icon: AlertTriangle,
    title: 'Silent Climber Alerts',
    description: 'Get notified when repositories show consistent growth without mainstream attention.'
  },
  {
    icon: Zap,
    title: 'Experimental Spike Detection',
    description: 'Identify sudden growth patterns that indicate emerging technologies or trends.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Built for Technical Signal Detection
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            Professional-grade analytics designed for developers, founders, and investors who need real technical insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:border-blue transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-surface border border-border">
                    <feature.icon className="w-5 h-5 text-blue" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
