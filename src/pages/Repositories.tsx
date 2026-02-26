import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Eye, ExternalLink, Filter } from "lucide-react";

interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  watchers: number;
  growth: number;
  category: string;
  url: string;
}

const mockRepos: Repository[] = [
  {
    id: '1',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    language: 'JavaScript',
    stars: 225000,
    forks: 45000,
    watchers: 6700,
    growth: 12.5,
    category: 'Frontend',
    url: 'https://github.com/facebook/react'
  },
  {
    id: '2',
    name: 'vue',
    description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework.',
    language: 'TypeScript',
    stars: 206000,
    forks: 33000,
    watchers: 5600,
    growth: 18.2,
    category: 'Frontend',
    url: 'https://github.com/vuejs/vue'
  },
  {
    id: '3',
    name: 'kubernetes',
    description: 'Production-Grade Container Scheduling and Management',
    language: 'Go',
    stars: 98000,
    forks: 35000,
    watchers: 3400,
    growth: 15.8,
    category: 'Infrastructure',
    url: 'https://github.com/kubernetes/kubernetes'
  },
  {
    id: '4',
    name: 'tensorflow',
    description: 'An Open Source Machine Learning Framework for Everyone',
    language: 'C++',
    stars: 185000,
    forks: 74000,
    watchers: 7800,
    growth: 22.1,
    category: 'AI / ML',
    url: 'https://github.com/tensorflow/tensorflow'
  },
  {
    id: '5',
    name: 'docker',
    description: 'Docker - the open-source application container engine',
    language: 'Go',
    stars: 67000,
    forks: 19000,
    watchers: 2100,
    growth: 8.9,
    category: 'Infrastructure',
    url: 'https://github.com/docker/docker'
  },
  {
    id: '6',
    name: 'vscode',
    description: 'Visual Studio Code - a source code editor developed by Microsoft',
    language: 'TypeScript',
    stars: 142000,
    forks: 24000,
    watchers: 3200,
    growth: 14.3,
    category: 'DevTools',
    url: 'https://github.com/microsoft/vscode'
  }
];

export default function Repositories() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('stars');

  const categories = ['all', 'Frontend', 'Infrastructure', 'AI / ML', 'DevTools', 'Backend'];
  const sortOptions = ['stars', 'forks', 'growth', 'watchers'];

  const filteredRepos = mockRepos
    .filter(repo => selectedCategory === 'all' || repo.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'stars': return b.stars - a.stars;
        case 'forks': return b.forks - a.forks;
        case 'growth': return b.growth - a.growth;
        case 'watchers': return b.watchers - a.watchers;
        default: return 0;
      }
    });

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full z-40">
        <Sidebar 
          activeItem="repositories"
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
              <h1 className="text-3xl font-bold text-primary mb-2">Repository Explorer</h1>
              <p className="text-secondary">Browse and filter repositories across different categories.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-secondary" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-surface border border-border rounded px-3 py-2 text-primary text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-secondary text-sm">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-surface border border-border rounded px-3 py-2 text-primary text-sm"
                >
                  {sortOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <Card key={repo.id} className="border-border hover:border-blue transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{repo.name}</CardTitle>
                        <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">{repo.category}</Badge>
                      </div>
                      <Badge variant="outline" className="text-xs border-green text-green bg-green/10">{repo.language}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary line-clamp-2">{repo.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-blue mb-1">
                          <Star className="w-3 h-3" />
                          <span className="text-sm font-medium">{formatNumber(repo.stars)}</span>
                        </div>
                        <p className="text-xs text-secondary">Stars</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-green mb-1">
                          <GitFork className="w-3 h-3" />
                          <span className="text-sm font-medium">{formatNumber(repo.forks)}</span>
                        </div>
                        <p className="text-xs text-secondary">Forks</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-yellow mb-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-sm font-medium">{formatNumber(repo.watchers)}</span>
                        </div>
                        <p className="text-xs text-secondary">Watchers</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-secondary">Growth:</span>
                        <span className={`text-sm font-medium ${repo.growth > 10 ? 'text-green' : 'text-secondary'}`}>
                          +{repo.growth}%
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={repo.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
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
