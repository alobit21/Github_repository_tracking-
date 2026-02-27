import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { RepoCard, type Repository } from "@/components/dashboard/RepoCard";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { TrendingUp, Activity } from "lucide-react";

interface DashboardContext {
  searchQuery: string;
  selectedLanguage: string;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (language: string) => void;
}

interface TrendingRepo extends Repository {
  trendScore: number;
  growthRate: number;
  dailyStars: number;
}

export default function Trending() {
  const { searchQuery, setSearchQuery } = useOutletContext<DashboardContext>();
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);

  useEffect(() => {
    async function fetchTrendingData() {
      try {
        const response = await fetch('/gittrack/data/daily-report.json');
        if (!response.ok) {
          throw new Error('Failed to fetch trending data');
        }
        
        const data = await response.json();
        
        // Transform real data to match our interface
        const transformedData: TrendingRepo[] = [
          ...data.emergingRockets.map((repo: any) => ({
            ...repo,
            id: repo.name,
            watchers: Math.floor(repo.stars * 0.3),
            pullRequests: Math.floor(repo.issues * 0.7),
            momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
            categories: getCategories(repo.name, repo.language),
            isOpenSource: true,
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            trendScore: Math.min(95, Math.floor(repo.starDelta / 50)),
            growthRate: parseFloat(((repo.starDelta / Math.max(repo.stars - repo.starDelta, 1)) * 100).toFixed(1)),
            dailyStars: repo.starDelta,
          })),
          ...data.silentClimbers.map((repo: any) => ({
            ...repo,
            id: repo.name,
            watchers: Math.floor(repo.stars * 0.3),
            pullRequests: Math.floor(repo.issues * 0.7),
            momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
            categories: getCategories(repo.name, repo.language),
            isOpenSource: true,
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            trendScore: Math.min(85, Math.floor(repo.starDelta / 30)),
            growthRate: parseFloat(((repo.starDelta / Math.max(repo.stars - repo.starDelta, 1)) * 100).toFixed(1)),
            dailyStars: repo.starDelta,
          })),
          ...data.experimentalSpike.map((repo: any) => ({
            ...repo,
            id: repo.name,
            watchers: Math.floor(repo.stars * 0.3),
            pullRequests: Math.floor(repo.issues * 0.7),
            momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
            categories: getCategories(repo.name, repo.language),
            isOpenSource: true,
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            trendScore: Math.min(90, Math.floor(repo.starDelta / 40)),
            growthRate: parseFloat(((repo.starDelta / Math.max(repo.stars - repo.starDelta, 1)) * 100).toFixed(1)),
            dailyStars: repo.starDelta,
          })),
        ];
        
        setTrendingRepos(transformedData);
      } catch (error) {
        console.error('Error fetching trending data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrendingData();
  }, []);

  // Helper function to categorize repositories
  const getCategories = (name: string, language: string | null): string[] => {
    const categories: string[] = [];
    const nameLower = name.toLowerCase();
    
    // Language-based categories
    if (language === 'TypeScript' || language === 'JavaScript') {
      categories.push('Frontend');
    } else if (language === 'Python') {
      categories.push('AI / ML');
    } else if (language === 'Rust' || language === 'Go') {
      categories.push('Infrastructure');
    } else if (language === 'C' || language === 'C++') {
      categories.push('DevTools');
    }
    
    // Name-based categories
    if (nameLower.includes('ai') || nameLower.includes('ml') || nameLower.includes('model') || nameLower.includes('gpt')) {
      categories.push('AI / ML');
    }
    if (nameLower.includes('web') || nameLower.includes('frontend') || nameLower.includes('ui') || nameLower.includes('react') || nameLower.includes('vue')) {
      categories.push('Frontend');
    }
    if (nameLower.includes('infra') || nameLower.includes('server') || nameLower.includes('cloud') || nameLower.includes('k8s')) {
      categories.push('Infrastructure');
    }
    if (nameLower.includes('dev') || nameLower.includes('tool') || nameLower.includes('cli') || nameLower.includes('build')) {
      categories.push('DevTools');
    }
    if (nameLower.includes('blockchain') || nameLower.includes('web3') || nameLower.includes('crypto') || nameLower.includes('eth')) {
      categories.push('Web3');
    }
    
    // Default category if none found
    if (categories.length === 0) {
      categories.push('Open Source');
    }
    
    return [...new Set(categories)]; // Remove duplicates
  };

  const filteredRepos = trendingRepos.filter(repo => {
    const matchesSearch = !searchQuery || 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategories = selectedCategories.includes('all') || 
      repo.categories.some(cat => selectedCategories.includes(cat));
    
    return matchesSearch && matchesCategories;
  });

  const kpiData: KpiData[] = [
    {
      title: 'Trending Repos',
      value: filteredRepos.length,
      delta: filteredRepos.reduce((sum, repo) => sum + repo.dailyStars, 0),
      accentColor: 'blue',
    },
    {
      title: 'Avg Growth Rate',
      value: parseFloat((filteredRepos.reduce((sum, repo) => sum + repo.growthRate, 0) / (filteredRepos.length || 1)).toFixed(1)),
      delta: 0,
      accentColor: 'green',
    },
    {
      title: 'Total Stars Today',
      value: filteredRepos.reduce((sum, repo) => sum + repo.dailyStars, 0),
      delta: 0,
      accentColor: 'yellow',
    },
    {
      title: 'Hot Repos (>90%)',
      value: filteredRepos.filter(repo => repo.trendScore > 90).length,
      delta: 0,
      accentColor: 'red',
    },
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
            <p className="text-secondary">Loading trending repositories...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Category Filter */}
        <div className="px-0 py-4 border-b border-border">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((kpi, index) => (
            <KpiCard key={index} data={kpi} />
          ))}
        </div>

        {/* Trending Repositories */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue" />
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Hot Trending</h2>
            <span className="px-2 sm:px-3 py-1 bg-blue text-white text-xs sm:text-sm rounded-full">
              {filteredRepos.filter(r => r.trendScore > 90).length} repos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredRepos
              .filter(repo => repo.trendScore > 90)
              .map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
          </div>

          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-green" />
            <h2 className="text-xl sm:text-2xl font-bold text-primary">Rising Fast</h2>
            <span className="px-2 sm:px-3 py-1 bg-green text-white text-xs sm:text-sm rounded-full">
              {filteredRepos.filter(r => r.growthRate > 5).length} repos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredRepos
              .filter(repo => repo.growthRate > 5 && repo.trendScore <= 90)
              .map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
