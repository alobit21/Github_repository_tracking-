import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, Eye, ExternalLink, Filter, Menu } from "lucide-react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-40 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar 
          activeItem="repositories"
          onItemClick={(item) => {
            console.log('Navigate to:', item.id);
            setIsSidebarOpen(false);
          }}
          isMobile={isMobile}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-background border-b border-border">
          <Header />
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-16 z-20 bg-background border-b border-border px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2"
          >
            <Menu className="w-4 h-4" />
            <span>Menu</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Repository Explorer</h1>
              <p className="text-secondary text-sm sm:text-base">Browse and filter repositories across different categories.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-secondary flex-shrink-0" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-surface border border-border rounded px-3 py-2 text-primary text-sm w-full sm:w-auto"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-secondary text-sm whitespace-nowrap">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-surface border border-border rounded px-3 py-2 text-primary text-sm w-full sm:w-auto"
                  >
                    {sortOptions.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredRepos.map((repo) => (
                <Card key={repo.id} className="border-border hover:border-blue transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base sm:text-lg mb-2 truncate">{repo.name}</CardTitle>
                        <Badge variant="outline" className="text-xs border-blue text-blue bg-blue/10">{repo.category}</Badge>
                      </div>
                      <Badge variant="outline" className="text-xs border-green text-green bg-green/10 flex-shrink-0">{repo.language}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary line-clamp-2">{repo.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 text-blue mb-1">
                          <Star className="w-3 h-3" />
                          <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.stars)}</span>
                        </div>
                        <p className="text-xs text-secondary">Stars</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-green mb-1">
                          <GitFork className="w-3 h-3" />
                          <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.forks)}</span>
                        </div>
                        <p className="text-xs text-secondary">Forks</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1 text-yellow mb-1">
                          <Eye className="w-3 h-3" />
                          <span className="text-xs sm:text-sm font-medium">{formatNumber(repo.watchers)}</span>
                        </div>
                        <p className="text-xs text-secondary">Watchers</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <span className="text-xs sm:text-sm text-secondary whitespace-nowrap">Growth:</span>
                        <span className={`text-xs sm:text-sm font-medium ${repo.growth > 10 ? 'text-green' : 'text-secondary'}`}>
                          +{repo.growth}%
                        </span>
                      </div>
                      <Button variant="outline" size="sm" asChild className="flex-shrink-0">
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
