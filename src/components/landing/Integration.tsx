import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Slack, MessageSquare, Zap } from 'lucide-react';

const integrations = [
  {
    name: 'GitHub',
    description: 'Direct integration with GitHub API for real-time repository data',
    icon: Github,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=600&h=400&fit=crop&auto=format',
    status: 'Connected'
  },
  {
    name: 'Slack',
    description: 'Get instant trend alerts and notifications in your Slack workspace',
    icon: Slack,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&auto=format',
    status: 'Available'
  },
  {
    name: 'Discord',
    description: 'Share trend insights with your community through Discord bots',
    icon: MessageSquare,
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=400&fit=crop&auto=format',
    status: 'Available'
  }
];

export function Integration() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Integrates With Your Workflow
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            SignalFromNoise seamlessly connects with the tools you already use.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card key={index} className="border-border overflow-hidden group hover:border-blue transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={integration.image} 
                  alt={integration.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={integration.status === 'Connected' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {integration.status}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent flex items-end">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <integration.icon className="w-6 h-6 text-white" />
                      <h3 className="text-lg font-semibold text-white">
                        {integration.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue flex-shrink-0 mt-0.5" />
                  <p className="text-secondary text-sm leading-relaxed">
                    {integration.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className="mt-16 text-center">
          <Card className="border-border bg-surface max-w-4xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-primary mb-4">
                Developer-First Integration
              </h3>
              <p className="text-secondary mb-6">
                Built with developers in mind. RESTful APIs, webhooks, and SDKs for custom integrations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge variant="outline" className="px-4 py-2">
                  REST API
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  Webhooks
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  SDK Available
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
