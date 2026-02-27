import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { CategoryFilter } from "@/components/dashboard/CategoryFilter";
import { KpiCard, type KpiData } from "@/components/dashboard/KpiCard";
import { MomentumChart, type ChartDataPoint } from "@/components/dashboard/MomentumChart";
import { Section } from "@/components/dashboard/Section";
import { CategoryDistribution, type CategoryData } from "@/components/dashboard/CategoryDistribution";
import { type Repository } from "@/components/dashboard/RepoCard";

interface DashboardContext {
  searchQuery: string;
  selectedLanguage: string;
  setSearchQuery: (query: string) => void;
  setSelectedLanguage: (language: string) => void;
}

interface RepoData {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  issues: number;
  language: string | null;
  url: string;
  starDelta: number;
  contributorDelta: number;
  issueDelta: number;
  score: number;
}

interface DailyReport {
  date: string;
  emergingRockets: RepoData[];
  silentClimbers: RepoData[];
  coolingDown: RepoData[];
  experimentalSpike: RepoData[];
}

// Transform RepoData to Repository format with better categorization
const transformToRepository = (repo: RepoData): Repository => {
  // Better categorization logic based on repo name and language
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
    
    // Add trending today for high momentum
    if (repo.starDelta > 1000) {
      categories.push('Trending Today');
    }
    
    return [...new Set(categories)]; // Remove duplicates
  };

  return {
    id: repo.name,
    name: repo.name,
    description: repo.description,
    url: repo.url,
    language: repo.language,
    stars: repo.stars,
    forks: repo.forks,
    watchers: Math.floor(repo.stars * 0.3), // Estimate watchers as 30% of stars
    pullRequests: Math.floor(repo.issues * 0.7), // Estimate PRs as 70% of issues
    starDelta: repo.starDelta,
    contributorDelta: repo.contributorDelta,
    issueDelta: repo.issueDelta,
    momentumScore: repo.score || (repo.starDelta * 2 + repo.contributorDelta * 5),
    categories: getCategories(repo.name, repo.language),
    isOpenSource: true,
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
};

export default function Dashboard() {
  const { searchQuery, selectedLanguage } = useOutletContext<DashboardContext>();
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [visibleLines, setVisibleLines] = useState({
    emergingRockets: true,
    silentClimbers: true,
    coolingDown: true,
    experimentalSpike: true,
  });

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch('/gittrack/data/daily-report.json');
        if (!response.ok) {
          throw new Error('Failed to fetch report');
        }
        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load trending data');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-secondary">Loading trending repositories...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red mb-4">{error || 'No data available'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-surface border border-border rounded text-primary hover:bg-card transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Transform data to Repository format and deduplicate
  const allReposMap = new Map<string, Repository>();
  
  // Process all categories and keep only unique repos
  const processCategory = (_categoryName: string, repos: RepoData[]) => {
    return repos
      .map(repo => transformToRepository(repo))
      .filter(repo => {
        // Check if this repo already exists in another category
        if (allReposMap.has(repo.id)) {
          return false; // Skip duplicate
        }
        allReposMap.set(repo.id, repo);
        return true;
      });
  };

  const allRepos = {
    emergingRockets: processCategory('emergingRockets', report.emergingRockets),
    silentClimbers: processCategory('silentClimbers', report.silentClimbers),
    coolingDown: processCategory('coolingDown', report.coolingDown),
    experimentalSpike: processCategory('experimentalSpike', report.experimentalSpike),
  };

  // Filter repositories based on search, categories, and language
  const filterRepos = (repos: Repository[]) => {
    return repos.filter(repo => {
      const matchesSearch = !searchQuery || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategories = selectedCategories.includes('all') || 
        repo.categories.some(cat => selectedCategories.includes(cat));
      
      const matchesLanguage = selectedLanguage === 'all' || repo.language === selectedLanguage;
      
      return matchesSearch && matchesCategories && matchesLanguage;
    });
  };

  const filteredRepos = {
    emergingRockets: filterRepos(allRepos.emergingRockets),
    silentClimbers: filterRepos(allRepos.silentClimbers),
    coolingDown: filterRepos(allRepos.coolingDown),
    experimentalSpike: filterRepos(allRepos.experimentalSpike),
  };

  // KPI data
  const kpiData: KpiData[] = [
    {
      title: 'Emerging Rockets',
      value: filteredRepos.emergingRockets.length,
      delta: filteredRepos.emergingRockets.reduce((sum, repo) => sum + repo.starDelta, 0),
      accentColor: 'blue',
    },
    {
      title: 'Silent Climbers',
      value: filteredRepos.silentClimbers.length,
      delta: filteredRepos.silentClimbers.reduce((sum, repo) => sum + repo.starDelta, 0),
      accentColor: 'green',
    },
    {
      title: 'Cooling Down',
      value: filteredRepos.coolingDown.length,
      delta: filteredRepos.coolingDown.reduce((sum, repo) => sum + repo.starDelta, 0),
      accentColor: 'red',
    },
    {
      title: 'Experimental Spike',
      value: filteredRepos.experimentalSpike.length,
      delta: filteredRepos.experimentalSpike.reduce((sum, repo) => sum + repo.starDelta, 0),
      accentColor: 'yellow',
    },
  ];

  // Mock chart data
  const chartData: ChartDataPoint[] = [
    { date: '2026-02-20', emergingRockets: 12, silentClimbers: 8, coolingDown: 3, experimentalSpike: 5 },
    { date: '2026-02-21', emergingRockets: 15, silentClimbers: 10, coolingDown: 4, experimentalSpike: 7 },
    { date: '2026-02-22', emergingRockets: 18, silentClimbers: 12, coolingDown: 5, experimentalSpike: 9 },
    { date: '2026-02-23', emergingRockets: 14, silentClimbers: 11, coolingDown: 6, experimentalSpike: 8 },
    { date: '2026-02-24', emergingRockets: 20, silentClimbers: 14, coolingDown: 4, experimentalSpike: 11 },
    { date: '2026-02-25', emergingRockets: 25, silentClimbers: 16, coolingDown: 7, experimentalSpike: 13 },
  ];

  // Category distribution data
  const categoryData: CategoryData[] = [
    { category: 'Frontend', count: 15, color: '#2f81f7' },
    { category: 'AI / ML', count: 12, color: '#3fb950' },
    { category: 'Infrastructure', count: 8, color: '#d29922' },
    { category: 'DevTools', count: 6, color: '#f85149' },
    { category: 'Open Source', count: 10, color: '#8b949e' },
  ];

  const handleLineToggle = (line: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [line]: !prev[line] }));
  };

  // Debug: Log the data to see what we're working with
  console.log('Dashboard Data:', {
    originalData: {
      emergingRockets: report.emergingRockets.length,
      silentClimbers: report.silentClimbers.length,
      coolingDown: report.coolingDown.length,
      experimentalSpike: report.experimentalSpike.length,
    },
    deduplicatedData: {
      emergingRockets: allRepos.emergingRockets.length,
      silentClimbers: allRepos.silentClimbers.length,
      coolingDown: allRepos.coolingDown.length,
      experimentalSpike: allRepos.experimentalSpike.length,
    },
    sampleRepos: {
      emerging: allRepos.emergingRockets.slice(0, 2).map(r => r.name),
      experimental: allRepos.experimentalSpike.slice(0, 2).map(r => r.name),
    }
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Category Filter */}
        <div className="px-0 py-4 border-b border-border">
          <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
          />
        </div>

        {/* Main Dashboard Content */}
        <div className="space-y-6 sm:space-y-8">
          {/* Page Header with Stats Overview */}
          <div className="bg-gradient-to-r from-blue/10 to-purple/10 border border-border rounded-xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3">Dashboard Overview</h1>
                <p className="text-secondary text-base sm:text-lg max-w-2xl">Real-time GitHub repository analytics and trending insights from the open-source community</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                    <span className="text-sm text-secondary">Live data</span>
                  </div>
                  <span className="text-sm text-secondary">•</span>
                  <span className="text-sm text-secondary">Last updated: Just now</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue">{Object.values(filteredRepos).reduce((sum, repos) => sum + repos.length, 0)}</div>
                  <p className="text-xs sm:text-sm text-secondary">Total Repos</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green">{filteredRepos.emergingRockets.length}</div>
                  <p className="text-xs sm:text-sm text-secondary">Trending</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-yellow">{filteredRepos.experimentalSpike.length}</div>
                  <p className="text-xs sm:text-sm text-secondary">Experimental</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple">{categoryData.length}</div>
                  <p className="text-xs sm:text-sm text-secondary">Categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-3">
                <div className="w-8 h-8 bg-blue/10 rounded-lg flex items-center justify-center">
                  <span className="text-blue text-sm font-bold">📊</span>
                </div>
                Key Performance Metrics
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {kpiData.map((kpi, index) => (
                <KpiCard key={index} data={kpi} />
              ))}
            </div>
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Chart and Repository Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Momentum Chart */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-3">
                    <div className="w-8 h-8 bg-green/10 rounded-lg flex items-center justify-center">
                      <span className="text-green text-sm font-bold">📈</span>
                    </div>
                    Momentum Trends
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse"></span>
                    <span className="text-xs sm:text-sm text-secondary">Live tracking</span>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm">
                  <MomentumChart
                    data={chartData}
                    visibleLines={visibleLines}
                    onLineToggle={handleLineToggle}
                  />
                </div>
              </section>

              {/* Repository Sections */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple/10 rounded-lg flex items-center justify-center">
                      <span className="text-purple text-sm font-bold">🚀</span>
                    </div>
                    Repository Insights
                  </h2>
                  <span className="text-xs sm:text-sm text-secondary bg-surface px-3 py-1 rounded-full">
                    {Object.values(filteredRepos).reduce((sum, repos) => sum + repos.length, 0)} active
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* Emerging Rockets */}
                  {filteredRepos.emergingRockets.length > 0 && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-border bg-gradient-to-r from-blue/5 via-blue/2 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">🚀</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">Emerging Rockets</h3>
                            <p className="text-secondary">High-growth repositories gaining momentum</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-blue bg-blue/10 px-2 py-1 rounded-full">{filteredRepos.emergingRockets.length} repos</span>
                              <span className="text-xs text-secondary">⬆️ Rising fast</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <Section
                          title="Emerging Rockets"
                          repos={filteredRepos.emergingRockets}
                          accentColor="blue"
                          maxItems={6}
                        />
                      </div>
                    </div>
                  )}

                  {/* Silent Climbers */}
                  {filteredRepos.silentClimbers.length > 0 && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-border bg-gradient-to-r from-green/5 via-green/2 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">🧗</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">Silent Climbers</h3>
                            <p className="text-secondary">Steady growth with consistent activity</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-green bg-green/10 px-2 py-1 rounded-full">{filteredRepos.silentClimbers.length} repos</span>
                              <span className="text-xs text-secondary">📈 Consistent</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <Section
                          title="Silent Climbers"
                          repos={filteredRepos.silentClimbers}
                          accentColor="green"
                          maxItems={6}
                        />
                      </div>
                    </div>
                  )}

                  {/* Experimental Spike */}
                  {filteredRepos.experimentalSpike.length > 0 && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-border bg-gradient-to-r from-yellow/5 via-yellow/2 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-black text-xl font-bold">⚡</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">Experimental Spike</h3>
                            <p className="text-secondary">Innovative projects with recent activity bursts</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-yellow bg-yellow/10 px-2 py-1 rounded-full">{filteredRepos.experimentalSpike.length} repos</span>
                              <span className="text-xs text-secondary">🔥 Hot</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <Section
                          title="Experimental Spike"
                          repos={filteredRepos.experimentalSpike}
                          accentColor="yellow"
                          maxItems={6}
                        />
                      </div>
                    </div>
                  )}

                  {/* Cooling Down */}
                  {filteredRepos.coolingDown.length > 0 && (
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="p-6 border-b border-border bg-gradient-to-r from-red/5 via-red/2 to-transparent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-red rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-xl font-bold">❄️</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-primary">Cooling Down</h3>
                            <p className="text-secondary">Projects with declining activity</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-red bg-red/10 px-2 py-1 rounded-full">{filteredRepos.coolingDown.length} repos</span>
                              <span className="text-xs text-secondary">📉 Declining</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <Section
                          title="Cooling Down"
                          repos={filteredRepos.coolingDown}
                          accentColor="red"
                          maxItems={6}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column - Category Distribution */}
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">📊</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">Category Distribution</h3>
                    <p className="text-secondary">Repository breakdown by category</p>
                  </div>
                </div>
                <CategoryDistribution
                  data={categoryData}
                  onCategoryClick={(category) => {
                    setSelectedCategories([category]);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
