import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { RepoCard, type Repository } from "@/components/dashboard/RepoCard";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { Star, Calendar } from "lucide-react";

interface DashboardContext {
  searchQuery: string;
  selectedLanguage: string;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (language: string) => void;
}

interface StarredRepo extends Repository {
  starredAt: string;
  starCategory: 'personal' | 'work' | 'learning' | 'reference';
  tags: string[];
}

export default function StarsPage() {
  const { searchQuery, setSearchQuery } = useOutletContext<DashboardContext>();
  const [starredRepos, setStarredRepos] = useState<StarredRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchStarredData() {
      try {
        const response = await fetch('/gittrack/data/daily-report.json');
        if (!response.ok) {
          throw new Error('Failed to fetch starred data');
        }
        
        const data = await response.json();
        
        // Get top repositories from all categories to simulate "starred" repos
        const allRepos = [
          ...data.emergingRockets,
          ...data.silentClimbers,
          ...data.experimentalSpike,
          ...data.coolingDown
        ];

        // Transform and categorize as starred repositories
        const starredData: StarredRepo[] = allRepos
          .sort((a: any, b: any) => b.stars - a.stars) // Sort by stars
          .slice(0, 20) // Take top 20
          .map((repo: any, index: number) => ({
            id: repo.name,
            name: repo.name,
            description: repo.description,
            url: repo.url,
            language: repo.language,
            stars: repo.stars,
            forks: repo.forks,
            watchers: Math.floor(repo.stars * 0.3),
            pullRequests: Math.floor(repo.issues * 0.7),
            starDelta: repo.starDelta,
            contributorDelta: repo.contributorDelta,
            issueDelta: repo.issueDelta,
            momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
            categories: getCategories(repo.name, repo.language),
            isOpenSource: true,
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            starredAt: new Date(Date.now() - (index * 15 + Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            starCategory: getStarCategory(repo.name, repo.language),
            tags: getTags(repo.name, repo.language),
          }));
        
        setStarredRepos(starredData);
      } catch (error) {
        console.error('Error fetching starred data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStarredData();
  }, []);

  // Helper functions
  const getCategories = (name: string, language: string | null): string[] => {
    const categories: string[] = [];
    const nameLower = name.toLowerCase();
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      categories.push('Frontend');
    } else if (language === 'Python') {
      categories.push('AI / ML');
    } else if (language === 'Rust' || language === 'Go') {
      categories.push('Infrastructure');
    } else if (language === 'C' || language === 'C++') {
      categories.push('DevTools');
    }
    
    if (nameLower.includes('ai') || nameLower.includes('ml') || nameLower.includes('model')) {
      categories.push('AI / ML');
    }
    if (nameLower.includes('web') || nameLower.includes('frontend') || nameLower.includes('react')) {
      categories.push('Frontend');
    }
    if (nameLower.includes('infra') || nameLower.includes('cloud') || nameLower.includes('server')) {
      categories.push('Infrastructure');
    }
    if (nameLower.includes('dev') || nameLower.includes('tool') || nameLower.includes('cli')) {
      categories.push('DevTools');
    }
    
    if (categories.length === 0) {
      categories.push('Open Source');
    }
    
    return [...new Set(categories)];
  };

  const getStarCategory = (name: string, language: string | null): 'personal' | 'work' | 'learning' | 'reference' => {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('tutorial') || nameLower.includes('learn') || nameLower.includes('course')) {
      return 'learning';
    }
    if (nameLower.includes('example') || nameLower.includes('demo') || nameLower.includes('template')) {
      return 'reference';
    }
    if (language === 'TypeScript' || language === 'JavaScript' || nameLower.includes('framework')) {
      return 'work';
    }
    
    // Randomly assign based on some heuristics
    const categories: ('personal' | 'work' | 'learning' | 'reference')[] = ['personal', 'work', 'learning', 'reference'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getTags = (name: string, language: string | null): string[] => {
    const tags: string[] = [];
    const nameLower = name.toLowerCase();
    
    if (language) {
      tags.push(language.toLowerCase());
    }
    
    if (nameLower.includes('react')) tags.push('react');
    if (nameLower.includes('vue')) tags.push('vue');
    if (nameLower.includes('angular')) tags.push('angular');
    if (nameLower.includes('next')) tags.push('nextjs');
    if (nameLower.includes('vite')) tags.push('vite');
    if (nameLower.includes('typescript')) tags.push('typescript');
    if (nameLower.includes('python')) tags.push('python');
    if (nameLower.includes('ai') || nameLower.includes('ml')) tags.push('ai');
    if (nameLower.includes('docker')) tags.push('docker');
    if (nameLower.includes('kubernetes')) tags.push('k8s');
    
    return tags.slice(0, 3); // Limit to 3 tags
  };

  const filteredRepos = starredRepos.filter(repo => {
    const matchesSearch = !searchQuery || 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      repo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategories = selectedCategories.includes('all') || 
      repo.categories.some(cat => selectedCategories.includes(cat));
    
    const matchesStarCategory = selectedCategory === 'all' || repo.starCategory === selectedCategory;
    
    return matchesSearch && matchesCategories && matchesStarCategory;
  });

  const kpiData: KpiData[] = [
    {
      title: 'Total Stars',
      value: filteredRepos.length,
      delta: 0,
      accentColor: 'yellow',
    },
    {
      title: 'Work Projects',
      value: filteredRepos.filter(r => r.starCategory === 'work').length,
      delta: 0,
      accentColor: 'blue',
    },
    {
      title: 'Learning',
      value: filteredRepos.filter(r => r.starCategory === 'learning').length,
      delta: 0,
      accentColor: 'green',
    },
    {
      title: 'Recently Starred',
      value: filteredRepos.filter(r => {
        const daysSinceStarred = (Date.now() - new Date(r.starredAt).getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceStarred <= 30;
      }).length,
      delta: 0,
      accentColor: 'red',
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue text-white';
      case 'learning': return 'bg-green text-white';
      case 'reference': return 'bg-yellow text-black';
      case 'personal': return 'bg-purple text-white';
      default: return 'bg-gray text-white';
    }
  };

  const formatStarDate = (starredAt: string) => {
    const date = new Date(starredAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
            <p className="text-secondary">Loading starred repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="px-0 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
            />
            
            {/* Star Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue w-full sm:w-auto"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="learning">Learning</option>
              <option value="reference">Reference</option>
              <option value="personal">Personal</option>
            </select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} data={kpi} />
          ))}
        </div>

        {/* Starred Repositories */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow" />
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Your Starred Repositories</h2>
            <span className="px-2 sm:px-3 py-1 bg-yellow text-black text-xs sm:text-sm rounded-full">
              {filteredRepos.length} repos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-blue transition-colors"
              >
                {/* Repo Header */}
                <div className="flex items-start justify-between mb-3">
                  <RepoCard
                    repo={repo}
                    className="flex-1"
                  />
                </div>

                {/* Star Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="text-sm text-secondary">
                      Starred {formatStarDate(repo.starredAt)}
                    </span>
                  </div>
                  
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(repo.starCategory)}`}>
                    {repo.starCategory}
                  </span>
                </div>

                {/* Tags */}
                {repo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {repo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-surface border border-border rounded text-xs text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
