import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Eye, GitBranch, Star, Users } from "lucide-react";

interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'trend' | 'opportunity' | 'warning' | 'growth';
  impact: 'high' | 'medium' | 'low';
  repositories: number;
  change: number;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Rust Adoption Surge',
    description: 'Rust-based repositories showing 45% increase in stars over the past month, indicating growing adoption in systems programming.',
    category: 'trend',
    impact: 'high',
    repositories: 127,
    change: 45.2
  },
  {
    id: '2',
    title: 'AI/ML Consolidation',
    description: 'Top AI repositories are consolidating market share, with fewer but larger projects dominating the landscape.',
    category: 'opportunity',
    impact: 'medium',
    repositories: 89,
    change: 12.7
  },
  {
    id: '3',
    title: 'Web3 Activity Decline',
    description: 'Blockchain and Web3 repositories showing 23% decrease in activity, suggesting market maturation or shift in focus.',
    category: 'warning',
    impact: 'medium',
    repositories: 156,
    change: -23.1
  },
  {
    id: '4',
    title: 'Frontend Framework Evolution',
    description: 'New meta-frameworks gaining traction as developers seek performance optimizations and better developer experience.',
    category: 'growth',
    impact: 'high',
    repositories: 203,
    change: 67.8
  }
];

export default function Insights() {
  const [insights] = useState<Insight[]>(mockInsights);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'opportunity': return <Lightbulb className="w-4 h-4" />;
      case 'warning': return <Eye className="w-4 h-4" />;
      case 'growth': return <GitBranch className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trend': return 'border-blue text-blue bg-blue/10';
      case 'opportunity': return 'border-green text-green bg-green/10';
      case 'warning': return 'border-yellow text-yellow bg-yellow/10';
      case 'growth': return 'border-purple text-purple bg-purple/10';
      default: return 'border-secondary text-secondary bg-secondary/10';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red';
      case 'medium': return 'text-yellow';
      case 'low': return 'text-green';
      default: return 'text-secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Repository Insights</h1>
            <p className="text-secondary text-sm sm:text-base">AI-powered insights and trends from repository data analysis.</p>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <Card key={insight.id} className="border-border hover:border-blue transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg border ${getCategoryColor(insight.category)}`}>
                        {getCategoryIcon(insight.category)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{insight.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-secondary">
                          <span className="capitalize">{insight.category}</span>
                          <span>•</span>
                          <span className={getImpactColor(insight.category)}>
                            {insight.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        insight.change > 0 ? 'text-green' : 'text-red'
                      }`}>
                        {insight.change > 0 ? '+' : ''}{insight.change}%
                      </div>
                      <div className="text-xs text-secondary">
                        {insight.repositories} repos
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-secondary leading-relaxed">
                    {insight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green" />
                  <span className="text-sm font-medium">Trending Up</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green">67%</div>
                <p className="text-xs text-secondary">of categories showing growth</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue" />
                  <span className="text-sm font-medium">Active Repos</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue">1,247</div>
                <p className="text-xs text-secondary">tracked this week</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow" />
                  <span className="text-sm font-medium">Top Insight</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-primary">Rust Surge</div>
                <p className="text-xs text-secondary">45% growth this month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
