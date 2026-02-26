import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity } from 'lucide-react';

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="secondary" className="text-xs">
            AI-Powered GitHub Intelligence
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center text-primary mb-6">
          Spot GitHub Momentum
          <br />
          Before the Crowd.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-secondary text-center max-w-3xl mx-auto mb-10">
          Analyze repository growth, detect emerging trends, and track category-level momentum across the open-source ecosystem.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="text-base px-8">
            Start Tracking Trends
          </Button>
          <Button variant="outline" size="lg" className="text-base px-8">
            View Live Dashboard
          </Button>
        </div>

        {/* Preview Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-secondary">Live Momentum Signals</h3>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+2,514</span>
                  </div>
                  <p className="text-xs text-secondary">cloudflare/vinext</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+1,537</span>
                  </div>
                  <p className="text-xs text-secondary">taste-skill</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">+1,310</span>
                  </div>
                  <p className="text-xs text-secondary">OpenPlanter</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-border">
                <Activity className="w-3 h-3 text-blue" />
                <span className="text-xs text-secondary">
                  Tracking 10,000+ repositories in real-time
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
